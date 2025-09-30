import { http, HttpResponse } from 'msw';
import { db } from '../db/talenshowDb';
import { candidatesDb } from '../db/candidatesDb';
import { assessmentsDb, type Assessment, type AssessmentResponse } from '../db/assessmentsDb';
import type { Job } from '../db/talenshowDb';
import type { Candidate } from '../db/candidatesDb';
import { v4 as uuidv4 } from 'uuid';

const paginate = <T>(array: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
};

function generateUniqueSlug(title: string, id: number): string {
  const cleanTitle = title.toLowerCase().replace(/\s+/g, '-');
  const randomSuffix = uuidv4().slice(0, 6);
  return `${cleanTitle}-${id}-${randomSuffix}`;
}


const RESPONSE_STORAGE_KEY = "localAssessmentResponses";

function loadResponses() {
  const stored = localStorage.getItem(RESPONSE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveResponses(responses: Record<string, any[]>) {
  localStorage.setItem(RESPONSE_STORAGE_KEY, JSON.stringify(responses));
}


const localAssessmentResponses: Record<string, any[]> = loadResponses();

export const handlers = [
 http.get('/api/jobs', async ({ request }) => {
    try {
      const url = new URL(request.url);

      const search = url.searchParams.get('search')?.trim().toLowerCase() || '';
      const status = url.searchParams.get('status') || '';
      const tagsParam = url.searchParams.get('tags') || '';
      const page = Number(url.searchParams.get('page') || 1);
      const pageSize = Number(url.searchParams.get('pageSize') || 5);
      const sort = url.searchParams.get('sort') || 'order';

      const tags = tagsParam
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      let jobs = await db.jobs.toArray();


      if (search) {
        jobs = jobs.filter(j => j.title.toLowerCase().includes(search));
      }
      if (status) {
        jobs = jobs.filter(j => j.status === status);
      }
      if (tags.length > 0) {
        jobs = jobs.filter(j => {
          const jobTags = new Set(j.tags.map(t => t.toLowerCase()));
          return tags.every(tag => jobTags.has(tag));
        });
      }


      const sortFields: Record<string, (a: Job, b: Job) => number> = {
        title: (a: Job, b: Job) => a.title.localeCompare(b.title),
        status: (a: Job, b: Job) => a.status.localeCompare(b.status),
        order: (a: Job, b: Job) => a.order - b.order,
        id: (a: Job, b: Job) => (a.id || 0) - (b.id || 0)
      };

      jobs.sort(sortFields[sort] || sortFields.order);


      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = jobs.slice(start, end);

      return HttpResponse.json(
        { total: jobs.length, data: paginated },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }),
  http.get('/api/jobs/:id', async ({ params }) => {
    const job = await db.jobs.get(Number(params.id));
    if (!job) return new HttpResponse('Not Found', { status: 404 });

    const candidates = await candidatesDb.candidates.where('jobId').equals(job.id!).toArray();
    return HttpResponse.json({ ...job, candidates }, { status: 200 });
  }),

  http.post('/api/jobs', async ({ request }) => {
    const body = (await request.json()) as Partial<Job>;
    if (!body.title) return new HttpResponse('Title required', { status: 400 });

    const id = await db.jobs.add({
      title: body.title,
      status: body.status || 'active',
      tags: body.tags || [],
      order: (await db.jobs.count()) + 1,
      slug: ''
    });

    const slug = generateUniqueSlug(body.title, id);
    await db.jobs.update(id, { slug });

    const saved = await db.jobs.get(id);
    return HttpResponse.json(saved, { status: 201 });
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const job = await db.jobs.get(id);
    if (!job) return new HttpResponse('Not Found', { status: 404 });

    const body = (await request.json()) as Partial<Job>;
    delete body.slug;

    await db.jobs.update(id, body);
    const updated = await db.jobs.get(id);
    return HttpResponse.json(updated, { status: 200 });
  }),

http.patch('/api/jobs/:id/reorder', async ({ request, params }) => {
  const { fromOrder, toOrder } = (await request.json()) as { fromOrder: number; toOrder: number };


  const jobs = await db.jobs.orderBy('order').toArray();

  if (jobs.length === 0) {
    return new HttpResponse('No jobs found', { status: 404 });
  }


  await db.transaction('rw', db.jobs, async () => {
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].order !== i + 1) {
        await db.jobs.update(jobs[i].id!, { order: i + 1 });
      }
    }
  });

  
  const repairedJobs = await db.jobs.orderBy('order').toArray();

  const moving = repairedJobs.find(job => job.order === fromOrder);
  if (!moving) {
    return new HttpResponse('Source job not found', { status: 404 });
  }

  const totalJobs = repairedJobs.length;
  if (toOrder < 1 || toOrder > totalJobs) {
    return new HttpResponse('Invalid target order', { status: 400 });
  }

  await db.transaction('rw', db.jobs, async () => {
    if (fromOrder < toOrder) {

      await db.jobs
        .where('order')
        .between(fromOrder + 1, toOrder, true, true)
        .modify(job => {
          job.order--;
        });
    } else if (fromOrder > toOrder) {
    
      await db.jobs
        .where('order')
        .between(toOrder, fromOrder - 1, true, true)
        .modify(job => {
          job.order++;
        });
    }


    await db.jobs.update(moving.id!, { order: toOrder });
  });

  return HttpResponse.json({ success: true }, { status: 200 });
})
,
http.patch('/api/jobs/reorder/smooth', async ({ request }) => {
  const { updates } = (await request.json()) as { updates: { id: number; order: number }[] };

  if (!updates || !Array.isArray(updates)) {
    return new HttpResponse('Invalid payload', { status: 400 });
  }

  await db.transaction('rw', db.jobs, async () => {
    for (const { id, order } of updates) {
      await db.jobs.update(id, { order });
    }
  });

  return HttpResponse.json({ success: true }, { status: 200 });
}),

 
  http.get('/api/candidates', async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const jobId = Number(url.searchParams.get('jobId') || 0);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 20);

    let candidates = await candidatesDb.candidates.toArray();

    if (jobId) candidates = candidates.filter(c => c.jobId === jobId);
    if (search) {
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (stage) {
      candidates = candidates.filter(c => c.stage === stage);
    }

    const total = candidates.length;
    const paginated = paginate(candidates, page, pageSize);

    return HttpResponse.json({ total, data: paginated }, { status: 200 });
  }),

  http.get('/api/candidates/:id', async ({ params }) => {
    const candidate = await candidatesDb.candidates.get(Number(params.id));
    if (!candidate) return new HttpResponse('Candidate Not Found', { status: 404 });
     const job = await db.jobs.get(candidate.jobId);
  const jobName = job?.title || "Unknown";
  return HttpResponse.json({ ...candidate, jobName }, { status: 200 })
  }),

  http.post('/api/candidates', async ({ request }) => {
  const body = (await request.json()) as Partial<Candidate>;

  if (!body.name || !body.email || !body.jobId) {
    return new HttpResponse('Name, Email, and JobId are required', { status: 400 });
  }


  const existing = await candidatesDb.candidates
    .where({ jobId: body.jobId, email: body.email })
    .first();

  if (existing) {
    return new HttpResponse(
      `Candidate with email ${body.email} already applied to this job`,
      { status: 409 } 
    );
  }

  const id = await candidatesDb.candidates.add({
    jobId: body.jobId,
    name: body.name,
    email: body.email,
    phone: body.phone || '',
    location: body.location || '',
    resumeUrl: body.resumeUrl || '',
    linkedin: body.linkedin || '',
    portfolio: body.portfolio || '',
    stage: body.stage || 'applied',
    dateApplied: body.dateApplied || new Date().toISOString(),
    experienceYears: body.experienceYears || 0,
    skills: body.skills || [],
    notes: body.notes || [],
    timeline: [
      { stage: body.stage || 'applied', date: new Date().toISOString() }
    ]
  });

  const created = await candidatesDb.candidates.get(id);
  return HttpResponse.json(created, { status: 201 });
}),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const candidate = await candidatesDb.candidates.get(id);
    if (!candidate) return new HttpResponse('Candidate Not Found', { status: 404 });

    const body = (await request.json()) as Partial<Candidate>;

    if (body.stage && body.stage !== candidate.stage) {
      candidate.timeline = candidate.timeline || [];
      candidate.timeline.push({ stage: body.stage, date: new Date().toISOString() });
    }

    await candidatesDb.candidates.update(id, { ...body, timeline: candidate.timeline });
    const updated = await candidatesDb.candidates.get(id);
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    const candidate = await candidatesDb.candidates.get(Number(params.id));
    if (!candidate) return new HttpResponse('Candidate Not Found', { status: 404 });
    return HttpResponse.json(candidate.timeline || [], { status: 200 });
  }),

  
  http.get('/api/assessments/:jobId', async ({ params }) => {
    const jobId = Number(params.jobId);
    const assessments = await assessmentsDb.assessments.where('jobId').equals(jobId).toArray();
    return HttpResponse.json(assessments, { status: 200 });
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    const jobId = Number(params.jobId);
    const body = (await request.json()) as Assessment;

    if (!body.title || !body.sections || !Array.isArray(body.sections)) {
      return new HttpResponse('Invalid assessment structure', { status: 400 });
    }

    if (body.id) {
      const existing = await assessmentsDb.assessments.get(body.id);
      if (!existing) return new HttpResponse('Assessment not found', { status: 404 });

      const { id, ...updateData } = body;
      updateData.updatedAt = new Date().toISOString();
      await assessmentsDb.assessments.update(body.id, updateData);
      const updated = await assessmentsDb.assessments.get(body.id);
      return HttpResponse.json(updated, { status: 200 });
    } else {
      const id = await assessmentsDb.assessments.add({
        ...body,
        jobId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: body.isActive ?? true
      });
      const newAssessment = await assessmentsDb.assessments.get(id);
      return HttpResponse.json(newAssessment, { status: 201 });
    }
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    const jobId = Number(params.jobId);
    const body = (await request.json()) as AssessmentResponse;

    if (!body.candidateId || !body.assessmentId || !body.answers) {
      return new HttpResponse('Missing required fields', { status: 400 });
    }

    const id = await assessmentsDb.responses.add({
      ...body,
      jobId,
      submittedAt: new Date().toISOString(),
      status: 'completed'
    });

    const savedResponse = await assessmentsDb.responses.get(id);
    return HttpResponse.json(savedResponse, { status: 201 });
  }),

  http.get('/api/assessments/:jobId/:assessmentId', async ({ params }) => {
  const jobId = Number(params.jobId);
  const assessmentId = Number(params.assessmentId);

  const assessment = await assessmentsDb.assessments.get(assessmentId);
  if (!assessment || assessment.jobId !== jobId) {
    return new HttpResponse('Assessment not found for this job', { status: 404 });
  }

  return HttpResponse.json(assessment, { status: 200 });
}),
http.post('/api/assessments/:jobId/:assessmentId/submit', async ({ params, request }) => {
  const jobId = Number(params.jobId);
  const assessmentId = Number(params.assessmentId);

  const body = (await request.json()) as Partial<AssessmentResponse>;

  // If candidateId is not provided, fail gracefully
  if (!body || !body.candidateId) {
    return new HttpResponse('candidateId is required', { status: 400 });
  }

  const responseIdKey = `${jobId}-${assessmentId}`;

  const newResponse: AssessmentResponse = {
    candidateId: body.candidateId,
    answers: body.answers || {},
    jobId,
    assessmentId,
    submittedAt: new Date().toISOString(),
    status: 'completed'
  };

  if (!localAssessmentResponses[responseIdKey]) {
    localAssessmentResponses[responseIdKey] = [];
  }
  localAssessmentResponses[responseIdKey].push(newResponse);

  saveResponses(localAssessmentResponses);

  return HttpResponse.json(newResponse, { status: 201 });
}),
http.get('/api/assessments/:jobId/:assessmentId/responses', async ({ params }) => {
  const jobId = Number(params.jobId);
  const assessmentId = Number(params.assessmentId);

  const responseIdKey = `${jobId}-${assessmentId}`;
  const responses = localAssessmentResponses[responseIdKey] || [];

  return HttpResponse.json(responses, { status: 200 });
}),
http.delete('/api/assessments/:jobId/:assessmentId/responses', async ({ params }) => {
  const jobId = Number(params.jobId);
  const assessmentId = Number(params.assessmentId);

  const responseIdKey = `${jobId}-${assessmentId}`;

  if (localAssessmentResponses[responseIdKey]) {
    delete localAssessmentResponses[responseIdKey];
    saveResponses(localAssessmentResponses);
    return HttpResponse.json({ success: true }, { status: 200 });
  } else {
    return new HttpResponse('Responses not found', { status: 404 });
  }
}),
http.get('/api/candidates/:candidateId/responses', async ({ params }) => {
  const candidateId = Number(params.candidateId);

  const allResponses = Object.values(localAssessmentResponses).flat();
  const candidateResponses = allResponses.filter(resp => resp.candidateId === candidateId);

  const formatted = candidateResponses.map(resp => ({
    assessmentId: resp.assessmentId,
    assessmentTitle: resp.assessmentTitle,
    responses: Object.entries(resp.answers || {}).map(([question, answer]) => ({
      question,
      answer: Array.isArray(answer) ? answer.join(", ") : String(answer),
    })),
  }));

  return HttpResponse.json(formatted, { status: 200 });
}),
  http.delete('/api/assessments/:id', async ({ params }) => {
  const id = Number(params.id);
  const existing = await assessmentsDb.assessments.get(id);
  if (!existing) return new HttpResponse('Not Found', { status: 404 });
  await assessmentsDb.assessments.delete(id);
  return HttpResponse.json({ success: true }, { status: 200 });
}),
];

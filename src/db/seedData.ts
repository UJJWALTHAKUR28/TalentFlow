import { db } from './talenshowDb';
import type { Job } from './talenshowDb';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const JOB_TITLES = [
  'Frontend Engineer',
  'Backend Developer',
  'Fullstack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Mobile App Developer',
  'Cloud Solutions Architect',
  'QA Engineer',
  'Security Analyst',
  'Site Reliability Engineer',
  'Database Administrator',
  'Software Architect',
  'Technical Writer',
  'AI Researcher',
  'Blockchain Developer',
  'Game Developer',
  'Network Engineer',
  'Systems Analyst',
  'Software Engineer Intern',
  'Data Engineer',
  'Scrum Master',
  'Cybersecurity Specialist',
  'Front-end Architect',
  'Backend API Developer',
  'Computer Vision Engineer',
  'Big Data Engineer',
  'AR/VR Developer'
];

const TAGS_POOL = [
  'react', 'nodejs', 'typescript', 'python', 'java', 'docker',
  'aws', 'ml', 'ai', 'sql', 'graphql', 'kubernetes', 'css',
  'html', 'design', 'testing', 'devops', 'security'
];

function randomTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 1; 
  const shuffled = TAGS_POOL.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateUniqueSlug(title: string, index: number): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const randomSuffix = uuidv4().slice(0, 6); 
  return `${cleanTitle}-${index + 1}-${randomSuffix}`;
}

export async function seedJobs() {
  const count = await db.jobs.count();
  if (count > 0) return; 

  const sampleJobs: Job[] = JOB_TITLES.map((title, i) => ({
    title,
    slug: generateUniqueSlug(title, i),
    status: Math.random() > 0.2 ? 'active' : 'archived', 
    tags: randomTags(),
    order: i + 1
  }));

  await db.jobs.bulkAdd(sampleJobs);
  console.log('Seeded jobs:', sampleJobs.length);
}

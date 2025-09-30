import { useEffect, useState } from "react";

interface Job { id: number; title: string; } 
interface Question { id: string; text: string; } 
interface Section { 
  title: string; 
  questions: Question[]; 
} 
  
interface Assessment { 
  id: number; 
  title: string; 
  description: string; 
sections: Section[]; } 

interface Response { candidateId: number; answers: Record<string, any>; submittedAt: string; }
export default function AssessmentResponsesList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [questionMap, setQuestionMap] = useState<Record<string, string>>({});
  const [jobTitle, setJobTitle] = useState<string>("");
  const [assessmentTitle, setAssessmentTitle] = useState<string>("");

  // Fetch jobs
  useEffect(() => {
    fetch("/api/jobs?page=1&pageSize=100")
      .then(res => res.json())
      .then(data => setJobs(data.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch assessments
  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(j => j.id === selectedJobId);
      setJobTitle(job?.title || "");

      fetch(`/api/assessments/${selectedJobId}`)
        .then(res => res.json())
        .then((data: Assessment[]) => setAssessments(data))
        .catch(err => console.error(err));
    }
  }, [selectedJobId, jobs]);

  // Fetch assessment details and responses
  useEffect(() => {
    if (selectedJobId && selectedAssessmentId) {
      fetch(`/api/assessments/${selectedJobId}/${selectedAssessmentId}`)
        .then(res => res.json())
        .then((assessment: Assessment) => {
          setAssessmentTitle(assessment.title || "");
          const map: Record<string, string> = {};
          assessment.sections?.forEach(section => {
            section.questions?.forEach(q => {
              map[q.id] = q.text;
            });
          });
          setQuestionMap(map);
        });

      fetch(`/api/assessments/${selectedJobId}/${selectedAssessmentId}/responses`)
        .then(res => res.json())
        .then(data => setResponses(data))
        .catch(err => console.error(err));
    }
  }, [selectedAssessmentId, selectedJobId]);

  const deleteResponses = () => {
    if (!confirm("Are you sure you want to delete all responses?")) return;

    fetch(`/api/assessments/${selectedJobId}/${selectedAssessmentId}/responses`, { method: "DELETE" })
      .then(() => setResponses([]))
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   
      <div className="bg-[#00241B]/80 rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-[#B5FFE1] mb-2 text-center">Assessment Responses</h1>
        <p className="text-xl text-[#93E5AB] text-center">
          Review candidate responses for your selected job and assessment
        </p>
      </div>

      
      <div className="bg-[#4E878C] rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div>
            <label className="font-semibold mb-2 block text-white items-center text-center text-xl ">Select Job</label>
            <select
              className="w-full border rounded-lg p-3 text-lg focus:ring-2 focus:ring-[#4E878C]"
              onChange={e => setSelectedJobId(Number(e.target.value))}
            >
              <option value="">Select a job</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          
          {assessments.length > 0 && (
            <div>
              <label className="font-semibold mb-2 block text-xl text-white">Select Assessment</label>
              <select
                className="w-full border rounded-lg p-3 text-lg focus:ring-2 focus:ring-[#4E878C]"
                onChange={e => setSelectedAssessmentId(Number(e.target.value))}
              >
                <option value="">Select an assessment</option>
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

   
      {responses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{jobTitle} → {assessmentTitle}</h2>
          <div className="space-y-6">
            {responses.map((resp, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Candidate ID:</span>
                  <span>{resp.candidateId}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Submitted At:</span>
                  <span>{new Date(resp.submittedAt).toLocaleString()}</span>
                </div>

                <h3 className="font-bold mb-2">Answers:</h3>
                <div className="space-y-3">
                  {Object.entries(resp.answers).map(([qid, answer]) => (
                    <div key={qid} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Question: {questionMap[qid] || qid}</p>
                      <p className="text-gray-700">Answer: {Array.isArray(answer) ? answer.join(", ") : answer.toString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              onClick={deleteResponses}
            >
              Delete All Responses
            </button>
          </div>
        </div>
      )}

      {responses.length === 0 && selectedAssessmentId && (
        <p className="mt-4 text-gray-500 text-center">No responses found for this assessment.</p>
      )}
    </div>
  );
}

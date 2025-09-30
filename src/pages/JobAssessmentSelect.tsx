import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, ClipboardList, ArrowRight, Building2 } from "lucide-react";

interface Job {
  id: number;
  title: string;
}

interface Assessment {
  id: number;
  title: string;
}

export default function JobAssessmentSelect() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [assessmentSearchTerm, setAssessmentSearchTerm] = useState("");

  
  useEffect(() => {
    fetch("/api/jobs?page=1&pageSize=100")
      .then(res => res.json())
      .then(data => setJobs(data.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedJobId !== null) {
      fetch(`/api/assessments/${selectedJobId}`)
        .then(res => res.json())
        .then(data => setAssessments(data))
        .catch(err => console.error(err));
    }
  }, [selectedJobId]);

  const handleStart = () => {
    if (selectedJobId && selectedAssessmentId) {
      navigate(`/assessments/${selectedJobId}/${selectedAssessmentId}`);
    }
  };


  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(assessmentSearchTerm.toLowerCase())
  );

  const selectedJob = jobs.find(job => job.id === selectedJobId);
  const selectedAssessment = assessments.find(assessment => assessment.id === selectedAssessmentId);

  return (
    <div className="min-h-full bg-gray-50">
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 py-7">
          <div className="text-center">
            <div className="flex justify-center ">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Job Assessment Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a job position and corresponding assessment to begin your evaluation process
            </p>
          </div>
        </div>
      </div>

      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-5">
              <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">1. Select Job Position</h2>
            </div>
           
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search job positions..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

         
            <div className="relative">
              <select 
                onChange={e => {
                  setSelectedJobId(Number(e.target.value));
                  setSelectedAssessmentId(null); 
                  setAssessmentSearchTerm(""); 
                }}
                value={selectedJobId || ""}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 font-medium"
              >
                <option value="" className="text-gray-500">Choose a job position</option>
                {filteredJobs.map(job => (
                  <option key={job.id} value={job.id} className="text-gray-900 py-2">{job.title}</option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {selectedJob.title}
                </p>
              </div>
            )}
          </div>

        
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${
            !selectedJobId ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}>
            <div className="flex items-center mb-6">
              <ClipboardList className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">2. Select Assessment</h2>
            </div>

            {!selectedJobId ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-3">
                  <ClipboardList className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">Please select a job position first</p>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500 text-lg">Loading assessments...</p>
              </div>
            ) : (
              <>
               
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search assessments..."
                    value={assessmentSearchTerm}
                    onChange={(e) => setAssessmentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

              
                <div className="relative">
                  <select 
                    onChange={e => setSelectedAssessmentId(Number(e.target.value))}
                    value={selectedAssessmentId || ""}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-gray-900 font-medium"
                  >
                    <option value="" className="text-gray-500">Choose an assessment</option>
                    {filteredAssessments.map(ass => (
                      <option key={ass.id} value={ass.id} className="text-gray-900 py-2">{ass.title}</option>
                    ))}
                  </select>
                </div>

                {selectedAssessment && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Selected:</strong> {selectedAssessment.title}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedJobId && selectedAssessmentId && (
          <div className="mt-8 text-center">
            <button
              onClick={handleStart}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
            >
              Start Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

  
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${selectedJobId ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedJobId ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                1
              </div>
              <span className="ml-3 font-medium">Job Selected</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded ${selectedJobId ? 'bg-green-200' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${selectedAssessmentId ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedAssessmentId ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <span className="ml-3 font-medium">Assessment Selected</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded ${selectedJobId && selectedAssessmentId ? 'bg-green-200' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${selectedJobId && selectedAssessmentId ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedJobId && selectedAssessmentId ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <span className="ml-3 font-medium">Ready to Start</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
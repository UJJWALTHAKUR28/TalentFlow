import React, { useEffect, useState } from "react";
import AssessmentDetailPage from "./AssessmentDetailsPage";

interface Job {
  id: number;
  title: string;
  slug: string;
}

const JobAssessmentPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch("/api/jobs?page=1&pageSize=100")
      .then((res) => res.json())
      .then((data) => setJobs(data.data || []))
      .catch((err) =>  {
      console.error("Failed to load jobs:", err);
      alert(`Reload Page`);
    });
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="bg-[#00241B]/80 text-[#B5FFE1] shadow-sm rounded-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Job Assessments
            </h1>
            <p className="text-[#93E5AB] text-xl max-w-2xl mx-auto">
              Search and select a job to view detailed assessment information
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
         
          <div className="bg-[#4E878C] text-white px-8 py-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Job Position</h2>
            
          
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for job positions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-600 rounded-xl text-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-20 focus:border-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

  
          <div className="p-9">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H10a2 2 0 00-2 2z" />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your search criteria to find available positions</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold text-slate-800">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pr-2">
                  {filteredJobs.map((job) => (
                    <button
                      key={job.id}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 mt-3 ${
                        selectedJob?.id === job.id
                          ? 'border-[#4E878C] bg-slate-50 shadow-lg transform -translate-y-1'
                          : 'border-gray-200 bg-white hover:border-slate-300'
                      }`}
                      onClick={() => handleSelectJob(job)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-sm text-[#65B891]">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            ID: {job.id}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {selectedJob?.id === job.id ? (
                            <div className="w-8 h-8 bg-[#65B891] rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-8 h-8 border-2 border-gray-300 rounded-full group-hover:border-slate-400 transition-colors duration-200"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

   
        {selectedJob && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#4E878C] text-white px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-3xl font-bold mb-2">
                    Assessment Details
                  </h2>
                  <p className="text-slate-300 text-xl">
                    {selectedJob.title}
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg px-6 py-3 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-sm text-slate-300 mb-1">Job ID</p>
                    <p className="text-lg font-bold">{selectedJob.id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <AssessmentDetailForJob jobId={selectedJob.id} />
            </div>
          </div>
        )}

      
        {!selectedJob && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="text-center py-20 px-8">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-20 w-20 text-[#4E878C] mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ready to View Assessments
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Select a job position from the search results above to view detailed assessment information, requirements, and evaluation criteria.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AssessmentDetailForJob: React.FC<{ jobId: number }> = ({ jobId }) => {
  return <AssessmentDetailPage jobId={jobId} />;
};

export default JobAssessmentPage;

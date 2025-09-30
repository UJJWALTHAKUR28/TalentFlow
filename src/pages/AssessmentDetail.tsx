import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AssessmentDetailsingle() {
  const { jobId, assessmentId } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/assessments/${jobId}/${assessmentId}`)
      .then(res => res.json())
      .then(data => setAssessment(data))
      .catch(err => console.error(err));
  }, [jobId, assessmentId]);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-[rgba(0,36,27,0.8)] text-white py-16 px-6 md:px-20 flex flex-col items-center justify-center text-center rounded-xl mb-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to Your Assessment
        </h1>
        <p className="max-w-2xl text-lg md:text-xl">
          Get ready to challenge yourself. This assessment is designed to test your skills and knowledge.
        </p>
      </section>

 
      <section className="bg-white text-black py-12 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">{assessment?.title || "Loading..."}</h2>
          <p className="text-md md:text-lg mb-8">
            {assessment?.description || "Fetching assessment details..."}
          </p>

    
          <div className="flex justify-center">
            <button
              onClick={() => navigate(`/assessments/${jobId}/${assessmentId}/response`)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </section>

   
      <section className="py-8 px-6 md:px-20 text-center">
        <p className="text-gray-600 text-sm md:text-base">
          Ensure your internet connection is stable before starting. Good luck!
        </p>
      </section>
    </div>
  );
}

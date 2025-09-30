import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AssessmentResponse() {
  const { jobId, assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Fetch assessment details
  useEffect(() => {
    if (jobId && assessmentId) {
      fetch(`/api/assessments/${jobId}/${assessmentId}`)
        .then(res => res.json())
        .then(data => setAssessment(data))
        .catch(err => console.error(err));
    }
  }, [jobId, assessmentId]);

  // Fetch candidates
  useEffect(() => {
    if (jobId) {
      fetch(`/api/candidates?jobId=${jobId}`)
        .then(res => res.json())
        .then(data => setCandidates(data.data || []))
        .catch(err => console.error(err));
    }
  }, [jobId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!selectedCandidateId) {
      alert("Please select a candidate first");
      return;
    }

    fetch(`/api/assessments/${jobId}/${assessmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: selectedCandidateId, answers }),
    })
      .then(res => res.json())
      .then(() => navigate("/responses"))
      .catch(err => console.error(err));
  };

  if (!assessment) return <div className="p-6 text-center">Loading assessment...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-7">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10 mb-8">
        <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
        <p className="text-gray-700">{assessment.description}</p>
      </div>


      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <label className="font-semibold block mb-2">Select Candidate:</label>
        <select
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-400"
          value={selectedCandidateId || ""}
          onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
        >
          <option value="">-- Select Candidate --</option>
          {candidates.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

 
      {selectedCandidateId && assessment.sections?.map((section: any, sectionIndex: number) => (
        <div key={sectionIndex} className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>

          {section.questions.map((question: any) => {

            if (question.conditional) {
              const dependentAnswer = answers[question.conditional.questionId];
              if (dependentAnswer !== question.conditional.value) return null;
            }

            return (
              <div key={question.id} className="mb-6">
                <label className="block font-semibold mb-2">{question.text} {question.required && "*"}</label>

 
                {question.type === "single-choice" && question.options?.map((option: string) => (
                  <label key={option} className="block mb-1">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      className="mr-2"
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                    />
                    {option}
                  </label>
                ))}

                {/* Multi Choice */}
                {question.type === "multi-choice" && question.options?.map((option: string) => (
                  <label key={option} className="block mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value={option}
                      checked={answers[question.id]?.includes(option) || false}
                      onChange={e => {
                        const prev = answers[question.id] || [];
                        if (e.target.checked) {
                          handleAnswerChange(question.id, [...prev, option]);
                        } else {
                          handleAnswerChange(question.id, prev.filter((o: string) => o !== option));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}

                {/* Short Text */}
                {question.type === "short-text" && (
                  <input
                    type="text"
                    maxLength={question.maxLength || undefined}
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-400"
                    value={answers[question.id] || ""}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                  />
                )}

                {/* Long Text */}
                {question.type === "long-text" && (
                  <textarea
                    maxLength={question.maxLength || undefined}
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-400"
                    value={answers[question.id] || ""}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                  />
                )}

        
                {question.type === "numeric" && (
                  <input
                    type="number"
                    min={question.range?.min}
                    max={question.range?.max}
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-400"
                    value={answers[question.id] || ""}
                    onChange={e => handleAnswerChange(question.id, Number(e.target.value))}
                  />
                )}

      
                {question.type === "file-upload" && (
                  <input
                    type="file"
                    className="mt-2"
                    onChange={e => handleAnswerChange(question.id, e.target.files ? e.target.files[0] : null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

 
      {selectedCandidateId && (
        <div className="max-w-4xl mx-auto flex justify-center mb-8">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            onClick={handleSubmit}
          >
            Submit Assessment
          </button>
        </div>
      )}
    </div>
  );
}

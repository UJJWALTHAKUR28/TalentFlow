import React, { useEffect, useState } from "react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  stage: string;
  jobId: number;
}

interface KanbanProps {
  jobId: number;
}

const stageConfig = [
  { id: "applied", label: "Applied", icon: "📝", color: "from-blue-500 to-blue-600" },
  { id: "screen", label: "Screening", icon: "📞", color: "from-yellow-500 to-yellow-600" },
  { id: "tech", label: "Technical", icon: "💻", color: "from-purple-500 to-purple-600" },
  { id: "offer", label: "Offer", icon: "💼", color: "from-emerald-500 to-emerald-600" },
  { id: "hired", label: "Hired", icon: "🎉", color: "from-green-500 to-green-600" },
  { id: "rejected", label: "Rejected", icon: "❌", color: "from-red-500 to-red-600" }
];

export default function CandidateKanban({ jobId }: KanbanProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let page = 1;
      const allCandidates: Candidate[] = [];

      while (true) {
        const res = await fetch(`/api/candidates?jobId=${jobId}&page=${page}&pageSize=50`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) break;

        allCandidates.push(...data.data);
        page++;

        if (data.data.length < 50) break;
      }

      setCandidates(allCandidates);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const moveCandidate = async (id: number, newStage: string) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, stage: newStage } : c))
    );

    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!res.ok) throw new Error("Failed to update candidate stage");

      await fetchCandidates();
    } catch (error) {
      console.error(error);
      fetchCandidates();
    }
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(null);

    if (draggedCandidate && draggedCandidate.stage !== stage) {
      moveCandidate(draggedCandidate.id, stage);
    }

    setDraggedCandidate(null);
  };

  const getCandidatesForStage = (stage: string) =>
    candidates.filter(c => c.stage === stage);

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600 text-lg font-medium">
            Loading candidates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Candidate Pipeline
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Track candidates through the hiring process
            </p>
          </div>
          <div className="bg-blue-100 rounded-xl px-4 py-2 border border-blue-200">
            <span className="text-blue-800 font-semibold">
              {candidates.length}
            </span>
            <span className="text-blue-600 ml-2">Total Candidates</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {stageConfig.map(stage => {
            const stageCandidates = getCandidatesForStage(stage.id);
            const isDragOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`bg-gray-50 rounded-xl border transition-all duration-300 flex flex-col ${
                  isDragOver
                    ? "border-blue-300 bg-blue-50 shadow-md"
                    : "border-gray-200"
                }`}
                onDragOver={e => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={e => handleDrop(e, stage.id)}
              >
                <div
                  className={`bg-gradient-to-r ${stage.color} p-4 rounded-t-xl`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <div>
                        <h3 className="text-white font-bold text-base lg:text-lg">
                          {stage.label}
                        </h3>
                        <p className="text-white/90 text-xs lg:text-sm">
                          {stageCandidates.length} candidates
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white font-bold">
                        {stageCandidates.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 min-h-[300px] max-h-[500px] overflow-y-auto">
                  {stageCandidates.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3 opacity-30">
                        {stage.icon}
                      </div>
                      <p className="text-gray-500 text-sm">
                        No candidates in this stage
                      </p>
                    </div>
                  ) : (
                    stageCandidates.map(candidate => (
                      <div
                        key={candidate.id}
                        draggable
                        onDragStart={e => handleDragStart(e, candidate)}
                        onDragEnd={() => {
                          setDraggedCandidate(null);
                          setDragOverStage(null);
                        }}
                        className={`group bg-white border border-gray-200 rounded-xl p-3 lg:p-4 cursor-grab transition-all duration-300 hover:shadow-md hover:border-gray-300 ${
                          draggedCandidate?.id === candidate.id
                            ? "opacity-50 rotate-1 scale-105 shadow-lg"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                          >
                            <span className="text-white font-bold text-xs lg:text-sm">
                              {getInitials(candidate.name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                              {candidate.name}
                            </h4>
                            <p className="text-gray-600 text-xs truncate mt-1">
                              {candidate.email}
                            </p>

                            <select
                              value={candidate.stage}
                              onChange={e =>
                                moveCandidate(candidate.id, e.target.value)
                              }
                              className="mt-3 w-full text-xs bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={e => e.stopPropagation()}
                            >
                              {stageConfig.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.icon} {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
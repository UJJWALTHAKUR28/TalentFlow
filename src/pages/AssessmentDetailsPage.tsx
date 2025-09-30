import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";

type QType = "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload";

interface Question {
  id: string;
  text: string;
  type: QType;
  required?: boolean;
  options?: string[];
  range?: { min: number; max: number };
  points?: number;
  conditional?: { questionId: string; value: string };
  maxLength?: number;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface Assessment {
  id?: number;
  jobId?: number;
  title: string;
  description?: string;
  sections: Section[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const emptyQuestion = (type: QType = "short-text"): Question => ({
  id: crypto.randomUUID(),
  text: "",
  type,
  required: false,
  options: type === "single-choice" || type === "multi-choice" ? [""] : undefined,
  points: 0,
  maxLength: undefined,
  range: undefined,
  conditional: undefined
});

const emptySection = (title = "Default Section"): Section => ({
  id: crypto.randomUUID(),
  title,
  questions: [emptyQuestion()]
});

const newAssessmentTemplate = (): Assessment => ({
  title: "New Assessment",
  description: "",
  sections: [emptySection()],
  isActive: true
});

interface AssessmentDetailPageProps {
  jobId?: number;
}

const AssessmentDetailPage: React.FC<AssessmentDetailPageProps> = ({ jobId: propJobId }) => {
  const { slug } = useParams<{ slug: string }>();
  const jobId = propJobId || (slug ? parseInt(slug) : null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, Assessment>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/assessments/${jobId}`);
        if (!res.ok) throw new Error("Failed to load assessments");
        const data = await res.json();
        setAssessments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchAssessments();
  }, [jobId]);

  const startEdit = (a?: Assessment) => {
    if (!a) {
      const temp = newAssessmentTemplate();
      setLocalEdits(prev => ({ ...prev, new: temp }));
      setEditingId("new");
    } else {
      setLocalEdits(prev => ({ ...prev, [String(a.id)]: deepCloneAssessment(a) }));
      setEditingId(a.id ?? null);
    }
  };

  const deepCloneAssessment = (a: Assessment): Assessment =>
    JSON.parse(JSON.stringify(a));

  const cancelEdit = (id: number | "new") => {
    setEditingId(null);
    setLocalEdits(prev => {
      const copy = { ...prev };
      delete copy[String(id)];
      return copy;
    });
  };

  const updateLocal = (idKey: number | "new", updater: (a: Assessment) => Assessment) => {
    setLocalEdits(prev => {
      const original = prev[String(idKey)];
      if (!original) return prev;
      const updated = updater(deepCloneAssessment(original));
      return { ...prev, [String(idKey)]: updated };
    });
  };

  const addSection = (idKey: number | "new") =>
    updateLocal(idKey, (a) => ({ ...a, sections: [...a.sections, emptySection(`Section ${a.sections.length + 1}`)] }));

  const removeSection = (idKey: number | "new", sIdx: number) =>
    updateLocal(idKey, (a) => ({ ...a, sections: a.sections.filter((_, i) => i !== sIdx) }));

  const addQuestion = (idKey: number | "new", sIdx: number, type: QType = "short-text") =>
    updateLocal(idKey, (a) => {
      const sections = [...a.sections];
      sections[sIdx].questions = [...sections[sIdx].questions, emptyQuestion(type)];
      return { ...a, sections };
    });

  const removeQuestion = (idKey: number | "new", sIdx: number, qIdx: number) =>
    updateLocal(idKey, (a) => {
      const sections = [...a.sections];
      sections[sIdx].questions = sections[sIdx].questions.filter((_, i) => i !== qIdx);
      return { ...a, sections };
    });

  const updateQuestionField = (
    idKey: number | "new",
    sIdx: number,
    qIdx: number,
    field: keyof Question,
    value: any
  ) => updateLocal(idKey, (a) => {
    const sections = [...a.sections];
    const q = { ...sections[sIdx].questions[qIdx], [field]: value };
    
    if ((field === "type") && (value === "single-choice" || value === "multi-choice") && !q.options) {
      q.options = [""];
    }
    
    sections[sIdx].questions[qIdx] = q;
    return { ...a, sections };
  });

  const addOption = (idKey: number | "new", sIdx: number, qIdx: number) =>
    updateLocal(idKey, (a) => {
      const sections = [...a.sections];
      const q = { ...sections[sIdx].questions[qIdx] };
      q.options = [...(q.options || []), ""];
      sections[sIdx].questions[qIdx] = q;
      return { ...a, sections };
    });

  const updateOption = (idKey: number | "new", sIdx: number, qIdx: number, oIdx: number, value: string) =>
    updateLocal(idKey, (a) => {
      const sections = [...a.sections];
      const q = { ...sections[sIdx].questions[qIdx] };
      q.options = [...(q.options || [])];
      q.options[oIdx] = value;
      sections[sIdx].questions[qIdx] = q;
      return { ...a, sections };
    });

  const removeOption = (idKey: number | "new", sIdx: number, qIdx: number, oIdx: number) =>
    updateLocal(idKey, (a) => {
      const sections = [...a.sections];
      const q = { ...sections[sIdx].questions[qIdx] };
      q.options = q.options!.filter((_, i) => i !== oIdx);
      sections[sIdx].questions[qIdx] = q;
      return { ...a, sections };
    });

  const saveAssessment = async (idKey: number | "new") => {
    const payload = localEdits[String(idKey)];
    if (!payload) return;

    setSaving(true);
    try {
        let res;
        if (idKey === "new") {
            // Create new assessment
            res = await fetch(`/api/assessments/${jobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload})
            });
        } else {
            // Update existing assessment
            res = await fetch(`/api/assessments/${idKey}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Save failed: ${res.status} ${text}`);
        }

        const saved = await res.json();
        setAssessments(prev => {
            const exists = prev.some(a => a.id === saved.id);
            if (exists) return prev.map(a => (a.id === saved.id ? saved : a));
            return [...prev, saved];
        });

        cancelEdit(idKey);
    } catch (err) {
        console.error(err);
        alert("Error saving assessment: " + (err as Error).message);
    } finally {
        setSaving(false);
    }
};


  const deleteAssessment = async (id?: number) => {
    if (!id) return alert("Missing id");
    if (!confirm("Delete this assessment?")) return;
    try {
      const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const renderQuestionEditor = (
    q: Question,
    sIdx: number,
    qIdx: number,
    idKey: number | "new",
    allQuestions: Question[]
  ) => (
    <div key={q.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
      <div className="space-y-6">
        <div>
          <p className="text-sm mb-2 text-gray-500">Question ID: {q.id}</p>
          <label className="block text-sm font-medium text-gray-800 mb-2">Question Text</label>
          <input
            type="text"
            placeholder="Enter your question here..."
            value={q.text}
            onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "text", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={q.type}
              onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "type", e.target.value as QType)}
            >
              <option value="short-text">Short Text</option>
              <option value="long-text">Long Text</option>
              <option value="single-choice">Single Choice</option>
              <option value="multi-choice">Multiple Choice</option>
              <option value="numeric">Numeric</option>
              <option value="file-upload">File Upload</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Settings</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={q.required || false}
                  onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "required", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Required</span>
              </label>
            </div>
          </div>
        </div>

        {q.type === "numeric" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
              <input
                type="number"
                placeholder="0"
                value={q.range?.min ?? ""}
                onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "range", {
                  ...q.range,
                  min: Number(e.target.value)
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
              <input
                type="number"
                placeholder="100"
                value={q.range?.max ?? ""}
                onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "range", {
                  ...q.range,
                  max: Number(e.target.value)
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
              <input
                type="number"
                placeholder="250"
                value={q.maxLength ?? ""}
                onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "maxLength", Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {(q.type === "short-text" || q.type === "long-text") && (
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
            <input
              type="number"
              placeholder="250"
              value={q.maxLength ?? ""}
              onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "maxLength", Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        )}

        {(q.type === "single-choice" || q.type === "multi-choice") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
            <div className="space-y-3">
              {(q.options || []).map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(idKey, sIdx, qIdx, optIdx, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => removeOption(idKey, sIdx, qIdx, optIdx)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => addOption(idKey, sIdx, qIdx)}
              >
                <Plus size={18} />
                <span>Add Option</span>
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Conditional Logic</label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!q.conditional}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateQuestionField(idKey, sIdx, qIdx, "conditional", { questionId: "", value: "" });
                  } else {
                    updateQuestionField(idKey, sIdx, qIdx, "conditional", undefined);
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Enable conditional logic</span>
            </label>
          </div>

          {q.conditional && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Dependent Question</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={q.conditional.questionId || ""}
                  onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "conditional", {
                    ...q.conditional!,
                    questionId: e.target.value
                  })}
                >
                  <option value="">Select dependent question</option>
                  {allQuestions
                    .filter((qu) => qu.id !== q.id)
                    .map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.text || question.id}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Trigger Value</label>
                <input
                  type="text"
                  placeholder="Enter trigger value"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={q.conditional.value || ""}
                  onChange={(e) => updateQuestionField(idKey, sIdx, qIdx, "conditional", {
                    ...q.conditional!,
                    value: e.target.value
                  })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => removeQuestion(idKey, sIdx, qIdx)}
          >
            <Trash2 size={16} />
            <span>Remove Question</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-4">Loading assessments...</div>;

  if (!assessments.length && editingId !== "new") {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">No assessments found for this job</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => startEdit()}>
          + Create new assessment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold">Assessments ({assessments.length})</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => startEdit()}>
            + New Assessment
          </button>
        </div>

        {assessments.map((a) => {
          const key = String(a.id ?? "");
          const isEditing = editingId === a.id;
          const edited = localEdits[key];

          return (
            <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{a.title}</h2>
                  <p className="text-sm text-gray-600">ID: {a.id} • JobId: {a.jobId}</p>
                </div>
                <div className="space-x-2">
                  {!isEditing ? (
                    <>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => startEdit(a)}>
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => deleteAssessment(a.id)}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => saveAssessment(a.id!)} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => cancelEdit(a.id!)}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isEditing && (
                <>
                  <p className="mb-4 text-gray-700">{a.description}</p>
                  {a.sections.map((s) => (
                    <div key={s.id} className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                      <ul className="ml-6 list-disc space-y-2">
                        {s.questions.map((q) => (
                          <li key={q.id}>
                            <span className="font-medium">{q.text}</span>
                            <span className="text-gray-500 ml-2">({q.type})</span>
                            {q.required && <span className="text-red-500 ml-2">*Required</span>}
                            {(q.type === "single-choice" || q.type === "multi-choice") && q.options && (
                              <ul className="ml-6 list-square text-gray-700">
                                {q.options.map((opt, idx) => <li key={idx}>{opt}</li>)}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              {isEditing && edited && (
                <div className="space-y-4">
                  <input
                    className="border p-3 w-full rounded-lg"
                    value={edited.title}
                    onChange={(e) => setLocalEdits(prev => ({ ...prev, [key]: { ...edited, title: e.target.value } }))}
                    placeholder="Assessment Title"
                  />
                  <textarea
                    className="border p-3 w-full rounded-lg"
                    value={edited.description}
                    onChange={(e) => setLocalEdits(prev => ({ ...prev, [key]: { ...edited, description: e.target.value } }))}
                    placeholder="Description"
                    rows={3}
                  />

                  {edited.sections.map((s, sIdx) => {
                    const allQuestions = edited.sections.flatMap(sec => sec.questions);
                    return (
                      <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-[#4E878C] px-6 py-4">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={s.title}
                              onChange={(e) => updateLocal(edited.id ?? a.id!, (curr) => {
                                curr.sections[sIdx].title = e.target.value;
                                return curr;
                              })}
                              className="flex-1 bg-transparent text-white text-lg font-semibold border-0 focus:ring-0 p-0"
                              placeholder="Section Title"
                            />
                            <button
                              onClick={() => removeSection(edited.id ?? a.id!, sIdx)}
                              className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors ml-4"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="p-6 space-y-6">
                          {s.questions.map((q, qIdx) =>
                            renderQuestionEditor(q, sIdx, qIdx, edited.id ?? a.id!, allQuestions)
                          )}

                          <div className="flex justify-center pt-4">
                            <button
                              className="flex items-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors"
                              onClick={() => addQuestion(edited.id ?? a.id!, sIdx)}
                            >
                              <Plus size={20} />
                              <span>Add Question</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    className="flex items-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors"
                    onClick={() => addSection(edited.id ?? a.id!)}
                  >
                    <Plus size={20} />
                    <span>Add Section</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {editingId === "new" && localEdits["new"] && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">New Assessment</h2>
            <div className="space-y-4">
              <input
                className="border p-3 w-full rounded-lg"
                value={localEdits["new"].title}
                onChange={(e) => setLocalEdits(prev => ({ ...prev, new: { ...prev["new"], title: e.target.value } }))}
                placeholder="Assessment Title"
              />
              <textarea
                className="border p-3 w-full rounded-lg"
                value={localEdits["new"].description}
                onChange={(e) => setLocalEdits(prev => ({ ...prev, new: { ...prev["new"], description: e.target.value } }))}
                placeholder="Description"
                rows={3}
              />

              {localEdits["new"].sections.map((s, sIdx) => {
                const allQuestions = localEdits["new"].sections.flatMap(sec => sec.questions);
                return (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-[#4E878C] px-6 py-4">
                      <div className="flex items-center justify-between">
                        <input
                          value={s.title}
                          onChange={(e) => updateLocal("new", (c) => {
                            c.sections[sIdx].title = e.target.value;
                            return c;
                          })}
                          className="flex-1 bg-transparent text-white text-lg font-semibold border-0 focus:ring-0 p-0"
                          placeholder="Section Title"
                        />
                        <button
                          onClick={() => removeSection("new", sIdx)}
                          className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors ml-4"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {s.questions.map((q, qIdx) =>
                        renderQuestionEditor(q, sIdx, qIdx, "new", allQuestions)
                      )}

                      <div className="flex justify-center pt-4">
                        <button
                          className="flex items-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors"
                          onClick={() => addQuestion("new", sIdx)}
                        >
                          <Plus size={20} />
                          <span>Add Question</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                className="flex items-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors"
                onClick={() => addSection("new")}
              >
                <Plus size={20} />
                <span>Add Section</span>
              </button>

              <div className="flex gap-4 pt-4">
                <button
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                  onClick={() => saveAssessment("new")}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Create Assessment"}
                </button>
                <button
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
                  onClick={() => cancelEdit("new")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetailPage;
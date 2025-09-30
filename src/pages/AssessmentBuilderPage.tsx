import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  slug: string;
}

interface Question {
  id: string;
  text: string;
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload";
  required?: boolean;
  options?: string[];
  range?: { min: number; max: number };
  conditional?: { questionId: string; value: string };
  maxLength?: number;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

const AssessmentBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch('/api/jobs?page=1&pageSize=100')
      .then(res => res.json())
      .then(data => setJobs(data.data))
      .catch(err => console.error("Failed to load jobs:", err));
  }, []);

  const handleJobSelect = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId) || null;
    setSelectedJob(job);
  };

  const addSection = () => {
    setSections([...sections, { id: crypto.randomUUID(), title: "New Section", questions: [] }]);
  };

  const updateSectionTitle = (index: number, value: string) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };

  const removeSection = (index: number) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const addQuestion = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions.push({
      id: crypto.randomUUID(),
      text: '',
      type: 'short-text',
      options: []
    });
    setSections(updated);
  };

  const updateQuestion = (sectionIndex: number, qIndex: number, field: keyof Question, value: any) => {
    const updated = [...sections];
    updated[sectionIndex].questions[qIndex] = {
      ...updated[sectionIndex].questions[qIndex],
      [field]: value
    };
    setSections(updated);
  };

  const removeQuestion = (sectionIndex: number, qIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions.splice(qIndex, 1);
    setSections(updated);
  };

  const addOption = (sectionIndex: number, qIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions[qIndex].options = [
      ...(updated[sectionIndex].questions[qIndex].options || []),
      ""
    ];
    setSections(updated);
  };

  const updateOption = (sectionIndex: number, qIndex: number, optIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].questions[qIndex].options![optIndex] = value;
    setSections(updated);
  };

  const removeOption = (sectionIndex: number, qIndex: number, optIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].questions[qIndex].options!.splice(optIndex, 1);
    setSections(updated);
  };

  const handleSubmit = async () => {
    if (!selectedJob) return alert("Select a job first");
    if (!title.trim()) return alert("Assessment title is required");
    if (sections.length === 0) return alert("Add at least one section");

    const payload = {
      title,
      description,
      sections,
      isActive: true
    };

    try {
      const response = await fetch(`/api/assessments/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to create/update assessment");
      navigate(`/assessments/${selectedJob.id}`);
    } catch (error) {
      console.error(error);
      alert("Error creating assessment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-[#00241B]/80 rounded-xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#B5FFE1] mb-2">Assessment Builder</h1>
          <p className="text-[#93E5AB]">Create comprehensive assessments for job positions</p>
        </div>
      
        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Select Job Position <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                value={selectedJob?.id || ''}
                onChange={(e) => handleJobSelect(Number(e.target.value))}
              >
                <option value="">Choose a job position...</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Assessment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assessment title..."
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of this assessment..."
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-8">
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div className="bg-[#4E878C] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                      className="w-full bg-transparent text-white text-lg font-semibold placeholder-slate-300 border-0 focus:ring-0 p-0"
                      placeholder="Section Title"
                    />
                  </div>
                  <button 
                    onClick={() => removeSection(sectionIndex)} 
                    className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Questions */}
              <div className="p-6 space-y-6">
                {section.questions.map((q, qIndex) => (
                  <div key={q.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="space-y-6">
                      {/* Question Text */}
                      <div>
                        <p className="text-sm mb-2 text-gray-500">
        Question ID: {q.id}  
      </p>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Question Text
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your question here..."
                          value={q.text}
                          onChange={(e) => updateQuestion(sectionIndex, qIndex, "text", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Question Type & Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={q.type}
                            onChange={(e) => updateQuestion(sectionIndex, qIndex, "type", e.target.value)}
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Settings
                          </label>
                          <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={q.required || false}
                                onChange={(e) => updateQuestion(sectionIndex, qIndex, "required", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Numeric Range */}
                      {q.type === "numeric" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Min Value
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={q.range?.min || ""}
                              onChange={(e) =>
                                updateQuestion(sectionIndex, qIndex, "range", {
                                  ...q.range,
                                  min: Number(e.target.value)
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Value
                            </label>
                            <input
                              type="number"
                              placeholder="100"
                              value={q.range?.max || ""}
                              onChange={(e) =>
                                updateQuestion(sectionIndex, qIndex, "range", {
                                  ...q.range,
                                  max: Number(e.target.value)
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Length
                            </label>
                            <input
                              type="number"
                              placeholder="250"
                              value={q.maxLength || ""}
                              onChange={(e) => updateQuestion(sectionIndex, qIndex, "maxLength", Number(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {/* Max Length for text fields */}
                      {(q.type === "short-text" || q.type === "long-text") && (
                        <div className="w-full md:w-1/3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Length
                          </label>
                          <input
                            type="number"
                            placeholder="250"
                            value={q.maxLength || ""}
                            onChange={(e) => updateQuestion(sectionIndex, qIndex, "maxLength", Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      )}

                      {/* Options */}
                      {(q.type === "single-choice" || q.type === "multi-choice") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Answer Options
                          </label>
                          <div className="space-y-3">
                            {(q.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(sectionIndex, qIndex, optIdx, e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => removeOption(sectionIndex, qIndex, optIdx)}
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => addOption(sectionIndex, qIndex)}
                            >
                              <Plus size={18} />
                              <span>Add Option</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Conditional Logic */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Conditional Logic
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!q.conditional}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateQuestion(sectionIndex, qIndex, "conditional", { questionId: "", value: "" });
                                } else {
                                  updateQuestion(sectionIndex, qIndex, "conditional", undefined);
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
                              <label className="block text-xs font-medium text-gray-500 mb-2">
                                Dependent Question
                              </label>
                              <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={q.conditional.questionId || ""}
                                onChange={(e) =>
                                  updateQuestion(sectionIndex, qIndex, "conditional", {
                                    ...q.conditional!,
                                    questionId: e.target.value
                                  })
                                }
                              >
                                <option value="">Select dependent question</option>
                                {sections[sectionIndex].questions
                                  .filter((_, idx) => idx !== qIndex)
                                  .map((question) => (
                                    <option key={question.id} value={question.id}>
                                      {question.text || question.id}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-2">
                                Trigger Value
                              </label>
                              <input
                                type="text"
                                placeholder="Enter trigger value"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={q.conditional.value || ""}
                                onChange={(e) =>
                                  updateQuestion(sectionIndex, qIndex, "conditional", {
                                    ...q.conditional!,
                                    value: e.target.value
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Remove Question Button */}
                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button 
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" 
                          onClick={() => removeQuestion(sectionIndex, qIndex)}
                        >
                          <Trash2 size={16} />
                          <span>Remove Question</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Question Button */}
                <div className="flex justify-center pt-4">
                  <button 
                    className="flex items-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors" 
                    onClick={() => addQuestion(sectionIndex)}
                  >
                    <Plus size={20} />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button 
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#4E878C] text-white rounded-lg hover:bg-[#4E878C]/70 transition-colors" 
              onClick={addSection}
            >
              <Plus size={20} />
              <span>Add Section</span>
            </button>

            <button 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold" 
              onClick={handleSubmit}
            >
              <Check size={20} />
              <span>Save Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CandidateKanban from "./CandidateKanban";
import type { Assessment } from "../db/assessmentsDb";

export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "candidates" | "assessments">("overview");

  const [editMode, setEditMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Job["status"]>("active");
  const [tags, setTags] = useState<string[]>([]);
  const [order, setOrder] = useState(0);
  const [newOrder, setNewOrder] = useState(0);

  const statusConfig = {
    active: { color: "bg-emerald-500 text-white shadow-emerald-500/25", icon: "🚀" },
    archived: { color: "bg-slate-500 text-white shadow-slate-500/25", icon: "📋" },
  };

  const getStatusColor = (status: Job["status"]) => statusConfig[status].color;
  const getStatusIcon = (status: Job["status"]) => statusConfig[status].icon;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        const jobData = await jobRes.json();
        setJob(jobData);
        setTitle(jobData.title);
        setStatus(jobData.status);
        setTags(jobData.tags);
        setOrder(jobData.order);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    const fetchAssessments = async () => {
      try {
        const res = await fetch(`/api/assessments/${jobId}`);
        const data = await res.json();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    };

    if (jobId) {
      fetchJobDetails();
      fetchAssessments();
    }
  }, [jobId]);

  const handleEditJob = async () => {
    if (!job) return;
    const updatedJob = { title, status, tags };
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJob),
    });
    if (res.ok) {
      const updated = await res.json();
      setJob(updated);
      setEditMode(false);
    } else {
      console.error("Failed to update job");
    }
  };

  const handleReorderJob = async () => {
    if (!job || newOrder === order) return;

    const res = await fetch(`/api/jobs/${job.id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromOrder: order, toOrder: newOrder }),
    });

    if (res.ok) {
      const updatedJobRes = await fetch(`/api/jobs/${job.id}`);
      if (updatedJobRes.ok) {
        const updatedJob = await updatedJobRes.json();
        setJob(updatedJob);
        setOrder(updatedJob.order);
        setReorderMode(false);
      }
    } else {
      console.error("Reorder failed");
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-800 font-semibold mb-2">
              Loading job details...
            </p>
            <p className="text-gray-600">
              Please wait while we fetch the information
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Header */}
          <div className="mb-8 flex justify-between items-center">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-xl font-medium border border-gray-200 shadow-sm"
            >
              ← Back to Jobs
            </Link>

            {/* Edit / Reorder Buttons */}
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditMode(!editMode);
                  setReorderMode(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {editMode ? "Cancel Edit" : "Edit Job"}
              </button>
              <button
                onClick={() => {
                  setReorderMode(!reorderMode);
                  setEditMode(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {reorderMode ? "Cancel Reorder" : "Reorder Job"}
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-8 py-12">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editMode ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 rounded-lg w-full"
                        placeholder="Job Title"
                      />
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Job["status"])}
                        className="p-2 rounded-lg w-full"
                      >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                      <input
                        type="text"
                        value={tags.join(", ")}
                        onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()))}
                        className="p-2 rounded-lg w-full"
                        placeholder="Comma-separated tags"
                      />
                      
                      <button
                        onClick={handleEditJob}
                        className="px-4 py-2 bg-blue-800 text-white rounded-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 mb-4">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${getStatusColor(job.status)}`}
                        >
                          <span className="mr-2">{getStatusIcon(job.status)}</span>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-sm rounded-lg font-medium">
                          Order #{job.order}
                        </span>
                      </div>

                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {job.title}
                      </h1>

                      <div className="flex items-center space-x-6 text-blue-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{job.tags.length} Tags</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono bg-white/10 px-2 py-1 rounded">
                            {job.slug}
                          </code>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-right bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-blue-200 text-sm font-medium mb-2">Job ID</p>
                  <p className="text-white font-mono text-2xl font-bold">#{job.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reorder Section */}
          {reorderMode && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="font-bold text-xl mb-4">Reorder Job</h2>
              <input
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(Number(e.target.value))}
                placeholder={`Current Order: ${order}`}
                className="p-2 border rounded w-40"
              />
              <button
                onClick={handleReorderJob}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Save Order
              </button>
              <button
                onClick={() => setReorderMode(false)}
                className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "candidates", label: "Candidates", icon: "👥" },
              { id: "assessments", label: "Assessments", icon: "📝" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "candidates" | "assessments")}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#00241B]/80 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{job.id}</div>
                  <div className="text-blue-700 font-medium">Job ID</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">#{job.order}</div>
                  <div className="text-purple-700 font-medium">Display Order</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{job.tags.length}</div>
                  <div className="text-green-700 font-medium">Tags</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
  <div className="flex flex-col items-center justify-center p-10">
    <p className="mb-4 text-lg font-medium">
      View Candidates in Kanban board
    </p>
    <Link
      to={`/jobs/${jobId}/kanban`}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
    >
      Open Kanban Board
    </Link>
  </div>
)}


          {activeTab === "assessments" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  {assessments.length} {assessments.length === 1 ? "Assessment" : "Assessments"}
                </span>
              </div>
              {assessments.length === 0 ? (
                <p className="text-gray-500">No assessments found</p>
              ) : (
                assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200 mb-4"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

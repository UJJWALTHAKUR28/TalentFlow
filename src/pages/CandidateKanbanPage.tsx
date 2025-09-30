import { useParams, Link } from "react-router-dom";
import CandidateKanban from "./CandidateKanban";

export default function CandidateKanbanPage() {
  const { jobId } = useParams();

  if (!jobId) return <div>Job ID is missing</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to={`/jobs/${jobId}`}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back to Job Details
        </Link>
      </div>

      {/* Kanban Board */}

      
      <CandidateKanban jobId={Number(jobId)} />
    </div>
  );
}

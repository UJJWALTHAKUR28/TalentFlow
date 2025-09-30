import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";

import JobListPage from "./pages/JobListPage";
import JobDetailPage from "./pages/JobDetailPage";
import CandidateListPage from "./pages/CandidateListPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import AssessmentBuilderPage from "./pages/AssessmentBuilderPage";
import AssessmentDetailPage from "./pages/AssessmentDetailsPage";
import JobAssessmentSelect from "./pages/JobAssessmentSelect";
import AssessmentDetailsingle from "./pages/AssessmentDetail";
import AssessmentResponsesList from "./pages/AssessmentResponsesList";
import AssessmentResponse from "./pages/AssessmentResponse";
import JobAssessmentPage from "./pages/JobAssessmentPage";
import CandidateForm from "./pages/CandiadateForm";
import DashboardPage from "./pages/DashboardPage";
import CandidateKanbanPage from "./pages/CandidateKanbanPage";

function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/" element={<LandingPage />} />

        
        <Route element={<Layout />}>
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs/:jobId/kanban" element={<CandidateKanbanPage />} />
          <Route path="/candidates" element={<CandidateListPage />} />
           <Route path="/addcandidates" element={<CandidateForm />} />
          <Route path="/candidates/:id" element={<CandidateProfilePage />} />
          <Route path="/assessments/create" element={<AssessmentBuilderPage />} />
          <Route path="/assessments/:slug" element={<AssessmentDetailPage />} />
          <Route path="/jobassesmentselect" element={<JobAssessmentSelect />} />
          <Route path="/job-assessments" element={<JobAssessmentPage />} />
          <Route path="/assessments/:jobId/:assessmentId" element={<AssessmentDetailsingle />} />
          <Route path="/assessments/:jobId/:assessmentId/response" element={<AssessmentResponse />} />
          <Route path="/responses" element={<AssessmentResponsesList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

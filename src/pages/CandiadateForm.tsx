import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, FileText, Linkedin, Briefcase, Calendar, Award, Tag, AlertCircle, CheckCircle } from "lucide-react";

interface Job {
  id: number;
  title: string;
}

const CandidateForm: React.FC<{ onSaved?: () => void; onClose?: () => void }> = ({
  onSaved = () => {},
  onClose = () => {},
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [status, setStatus] = useState<
    "applied" | "screen" | "tech" | "offer" | "hired" | "rejected"
  >("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [skills, setSkills] = useState<string>("");

  // Error handling state
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // fetch jobs for dropdown
  useEffect(() => {
    fetch("/api/jobs?page=1&pageSize=100")
      .then((res) => res.json())
      .then((data) => setJobs(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const saveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!jobId || !name || !email) {
      setErrorMessage("Job, Name, and Email are required.");
      return;
    }

    const payload = {
      jobId,
      name,
      email,
      phone,
      location,
      resumeUrl,
      linkedin,
      portfolio,
      stage: status,
      dateApplied: dateApplied || new Date().toISOString(),
      experienceYears,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage("Candidate saved successfully!");
        setTimeout(() => {
          onSaved();
          onClose();
        }, 1500);
      } else if (res.status === 409) {
        const msg = await res.text();
        setErrorMessage(msg || "Candidate with this email already applied to this job.");
      } else {
        const msg = await res.text();
        setErrorMessage(`Error saving candidate: ${msg}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#4E878C] px-8 py-6 text-center">
        <h2 className="text-3xl font-bold text-white flex justify-center items-center gap-3">
          <User className="w-8 h-8" />
          <span className="text-center">Create New Candidate</span>
        </h2>
        <p className="text-blue-100 mt-2">Add a new candidate to the recruitment pipeline</p>
      </div>

          <div className="p-8">
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Success</p>
                  <p className="text-green-700 text-sm mt-1">{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={saveCandidate} className="space-y-6">
              {/* Job Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Job Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={jobId ?? ""}
                  onChange={(e) => setJobId(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-slate-900"
                  required
                >
                  <option value="">-- Select a Job Position --</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Information Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Links Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Professional Links
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Resume URL
                    </label>
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        Portfolio
                      </label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="https://portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Application Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-slate-900"
                    >
                      <option value="applied">Applied</option>
                      <option value="screen">Screening</option>
                      <option value="tech">Technical Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Date Applied
                    </label>
                    <input
                      type="date"
                      value={dateApplied}
                      onChange={(e) => setDateApplied(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      Skills
                    </label>
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="React, Node.js, SQL"
                    />
                    <p className="text-xs text-slate-500 mt-1">Separate skills with commas</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Candidate
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 focus:ring-4 focus:ring-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
import { useEffect, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, FileText, Clock,
  ArrowLeft, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Candidate {
  id: number;
  jobId: number;
  jobName?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  notes?: string[];
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  appliedDate?: string;       
  dateApplied?: string;        
  experience?: string;         
  experienceYears?: number;  
  skills?: string[];
  resumeUrl?: string;
  linkedin?: string;          
  portfolio?: string;         
  timeline?: TimelineEvent[];
}

interface TimelineEvent {
  stage: string;
  date: string;
  notes?: string;
  author?: string;
}

interface AssessmentResponse {
  assessmentId: number;
  assessmentTitle: string;
  responses: { question: string; answer: string }[];
}

const stageColors = {
  applied: 'bg-blue-100 text-blue-800 border-blue-200',
  screen: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  tech: 'bg-purple-100 text-purple-800 border-purple-200',
  offer: 'bg-orange-100 text-orange-800 border-orange-200',
  hired: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const stageOrder = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

export default function CandidateProfilePage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] =
    useState<'overview' | 'timeline' | 'notes' | 'assessments'>('overview');
  const [newNote, setNewNote] = useState('');
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponse[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = Number(urlParams.get('id') || window.location.pathname.split('/').pop() || 1);

  useEffect(() => {
    const loadCandidateData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/candidates/${candidateId}`);
        const data = await res.json();
        setCandidate(data);
      } catch (error) {
        console.error('Failed to load candidate data:', error);
        setCandidate(null);
      } finally {
        setLoading(false);
      }
    };

    const loadAssessmentResponses = async () => {
      try {
        const res = await fetch(`/api/candidates/${candidateId}/responses`);
        const data = await res.json();
        setAssessmentResponses(data);
      } catch (error) {
        console.error('Failed to load assessment responses:', error);
        setAssessmentResponses([]);
      }
    };

    loadCandidateData();
    loadAssessmentResponses();
  }, [candidateId]);

  const handleAddNote = async () => {
    if (newNote.trim() && candidate) {
      try {
        const response = await fetch(`/api/candidates/${candidateId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: [...(candidate.notes || []), newNote.trim()] }),
        });

        if (response.ok) {
          const updated = await response.json();
          setCandidate(updated);
          setNewNote('');
        }
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  const handleStageChange = async (newStage: string) => {
    if (candidate && newStage !== candidate.stage) {
      try {
        const response = await fetch(`/api/candidates/${candidateId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage }),
        });

        if (response.ok) {
          const updated = await response.json();
          setCandidate(updated);
        }
      } catch (error) {
        console.error('Failed to update stage:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
          <p className="text-gray-500">The candidate you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link
              to="/candidates"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to candidates
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {candidate.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{candidate.phone}</span>
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                    )}
                  </div>

                  {/* NEW: Job ID and Job Name */}
                  <div className="mt-2 text-gray-600">
                    <p className="text-sm">Job ID: {candidate.jobId}</p>
                    {candidate.jobName && (
                      <p className="text-sm">Job Name: {candidate.jobName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Stage</p>
                  <select
                    value={candidate.stage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className={`mt-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                      stageColors[candidate.stage as keyof typeof stageColors] ||
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {stageOrder.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[{ id: 'overview', name: 'Overview', icon: User },
              { id: 'timeline', name: 'Timeline', icon: Clock },
              { id: 'notes', name: 'Notes', icon: MessageSquare },
              { id: 'assessments', name: 'Assessments', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>


        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidate Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applied Date</label>
                    <p className="mt-1 text-gray-900">
                      {candidate.dateApplied
                        ? new Date(candidate.dateApplied).toLocaleDateString()
                        : candidate.appliedDate
                        ? new Date(candidate.appliedDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="mt-1 text-gray-900">
                      {candidate.experienceYears !== undefined
                        ? `${candidate.experienceYears} years`
                        : candidate.experience || 'N/A'}
                    </p>
                  </div>

                  {candidate.linkedin && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                      <p className="mt-1">
                        <a
                          href={candidate.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {candidate.linkedin}
                        </a>
                      </p>
                    </div>
                  )}

                  {candidate.portfolio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Portfolio / GitHub</label>
                      <p className="mt-1">
                        <a
                          href={candidate.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {candidate.portfolio}
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-500">Skills</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.resumeUrl && (
                  <div className="mt-6">
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <FileText className="h-4 w-4" />
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
            <div className="space-y-6">
              {(candidate.timeline || []).map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{event.stage}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleString()}
                      </span>
                    </div>
                    {event.notes && <p className="text-gray-600 mb-2">{event.notes}</p>}
                    {event.author && <p className="text-xs text-gray-500">by {event.author}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Note</h2>
              <div className="space-y-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this candidate..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              {candidate.notes && candidate.notes.length > 0 ? (
                <div className="space-y-4">
                  {candidate.notes.map((note, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{note}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Added on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notes yet. Add one above to get started.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            {assessmentResponses.length > 0 ? (
              assessmentResponses.map((assessment) => (
                <div
                  key={assessment.assessmentId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {assessment.assessmentTitle}
                  </h2>
                  {assessment.responses.map((resp, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-medium text-gray-800">{resp.question}</p>
                      <p className="text-gray-600 ml-4">{resp.answer}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No assessments taken yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

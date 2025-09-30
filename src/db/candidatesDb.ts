import Dexie from 'dexie';

export interface AssessmentStatus {
  assessmentId: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'expired' | 'error';
  title?: string;
  submittedAt?: string;
  startedAt?: string;
  score?: number;
  dueDate?: string;
  lastUpdated: string;
  attempts: number;
  errorMessage?: string;
  timeSpent?: number; 
  isLocked?: boolean;
}

export interface Candidate {
  id?: number;
  jobId: number; 
  name: string;
  email: string;
  phone: string;              
  location: string;           
  resumeUrl?: string;         
  linkedin?: string;         
  portfolio?: string;        
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  dateApplied: string;       
  experienceYears: number;    
  skills: string[];           
  notes?: string[];          
  timeline?: { stage: string; date: string }[];
 
  assessmentStatus?: AssessmentStatus[];
  hasAssessments?: boolean;
  assessmentsCompleted?: number;
  assessmentsTotal?: number;
}

class CandidatesDB extends Dexie {
  candidates!: Dexie.Table<Candidate, number>;

  constructor() {
    super('CandidatesDB');
    this.version(3).stores({
      candidates: '++id, jobId, email, [jobId+email],stage, name, skills, hasAssessments'
    });
  }
}

export const candidatesDb = new CandidatesDB();
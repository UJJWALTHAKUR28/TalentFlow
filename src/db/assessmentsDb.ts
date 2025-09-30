import Dexie, {type Table } from "dexie";

export interface Question {
  id: string;
  text: string;
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload";
  required?: boolean;
  options?: string[]; 
  range?: { min: number; max: number };
  conditional?: { questionId: string; value: string }; 
  points?: number; 
}

export interface Assessment {
  id?: number;
  jobId: number;
  title: string;
  description?: string;
  sections: { title: string; questions: Question[] }[];
  dueDate?: string;
  timeLimit?: number; // minutes
  passingScore?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  id?: number;
  jobId: number;
  candidateId: number;
  assessmentId: number; // ADDED: Direct reference to assessment
  answers: Record<string, any>; // key = questionId
  submittedAt: string;
  startedAt?: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  timeSpent?: number; // minutes
}

// NEW: Track assessment assignments
export interface AssessmentAssignment {
  id?: number;
  jobId: number;
  candidateId: number;
  assessmentId: number;
  assignedAt: string;
  dueDate?: string;
  status: 'assigned' | 'started' | 'completed' | 'overdue' | 'expired';
  remindersSent: number;
}

export class AssessmentsDB extends Dexie {
  assessments!: Table<Assessment, number>;
  responses!: Table<AssessmentResponse, number>;
  assignments!: Table<AssessmentAssignment, number>; // NEW TABLE

  constructor() {
    super("AssessmentsDB");
    this.version(2).stores({
      assessments: "++id,jobId,title,isActive",
      responses: "++id,jobId,candidateId,assessmentId,[jobId+candidateId],[assessmentId+candidateId]",
      assignments: "++id,jobId,candidateId,assessmentId,[jobId+candidateId],status" // NEW
    });
  }
}

export const assessmentsDb = new AssessmentsDB();
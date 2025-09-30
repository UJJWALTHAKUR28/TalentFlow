import Dexie, { type Table } from 'dexie';

export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
}

export class JobsDB extends Dexie {
  jobs!: Table<Job, number>;

  constructor() {
    super('jobsDb');
    this.version(1).stores({
      jobs: '++id, slug, status, order', // indexes
    });
  }
}

export const db = new JobsDB();

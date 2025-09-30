import type { Candidate } from './candidatesDb';
import { candidatesDb } from './candidatesDb';
import { db } from './talenshowDb';

const FIRST_NAMES = [
  'John','Jane','Alex','Chris','Taylor','Jordan','Morgan','Casey','Riley','Drew',
  'Sam','Blake','Avery','Quinn','Reese','Cameron','Sage','Emery','Rowan','Skyler',
  'Jamie','Devon','Hayden','Parker','River','Dakota','Logan','Bailey','Payton','Harper',
  'Elliot','Finley','Alexis','Sydney','Charlie','Reagan','Marley','Kai','Sawyer','Lennon',
  'Addison','Peyton','Phoenix','Spencer','Shawn','Micah','Rory','Blair','Tatum','Emerson',
  'Grayson','Hunter','Jesse','Kendall','Lane','Leslie','Morgan','Noel','Pat','Rory','Shane',
  'Toby','Van','Whitney','Aidan','Brett','Corey','Dallas','Evan','Flynn','Glen','Jaden','Kieran',
  'Liam','Miles','Nico','Orion','Ryder','Sterling','Tristan','Victor','Wesley','Zane'
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson',
  'Martinez','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White',
  'Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall',
  'Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson',
  'Hill','Ramirez','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres',
  'Patterson','Powell','Long','Hughes','Flores','Washington','Butler','Simmons','Foster','Gonzales',
  'Bryant','Alexander','Russell','Griffin','Diaz','Hayes','Myers','Ford','Hamilton','Graham',
  'Sullivan','Wallace','Woods','Cole','West','Jordan','Owens','Reynolds','Fisher','Ellis'
];


const LOCATIONS = ['New York', 'San Francisco', 'London', 'Berlin', 'Bangalore', 'Toronto', 'Sydney', 'Paris'];
const SKILLS = ['React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Java', 'C++', 'Machine Learning', 'TypeScript'];

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;

function randomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function randomEmail(name: string): string {
  const clean = name.toLowerCase().replace(/\s/g, '.');
  return `${clean}${Math.floor(Math.random() * 1000)}@example.com`;
}

function randomStage(): typeof STAGES[number] {
  return STAGES[Math.floor(Math.random() * STAGES.length)];
}

function randomPhone(): string {
  return `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomLocation(): string {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

function randomSkills(): string[] {
  const shuffled = [...SKILLS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 2); // 2–5 skills
}

export async function clearDatabases() {
  await db.jobs.clear();
  await candidatesDb.candidates.clear();
  console.log('Databases cleared');
}

export async function seedCandidates(count: number = 1000) {
  const jobIds = (await db.jobs.toArray()).map(job => job.id!).filter(Boolean);
  if (jobIds.length === 0) {
    console.error('No jobs found. Seed jobs first.');
    return;
  }

  const count1 = await candidatesDb.candidates.count();
  if (count1 > 0) return; 
  const sampleCandidates: Candidate[] = Array.from({ length: count }, () => {
    
    const name = randomName();
    const stage = randomStage();
    return {
      jobId: jobIds[Math.floor(Math.random() * jobIds.length)],
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      location: randomLocation(),
      resumeUrl: `https://example.com/resumes/${name.replace(/\s/g, '_')}.pdf`,
      linkedin: `https://linkedin.com/in/${name.replace(/\s/g, '').toLowerCase()}`,
      portfolio: `https://github.com/${name.split(' ')[0].toLowerCase()}`,
      stage,
      dateApplied: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(), // within last 30 days
      experienceYears: Math.floor(Math.random() * 10), // 0–9 years
      skills: randomSkills(),
      notes: [],
      timeline: [{ stage: 'applied', date: new Date().toISOString() }]
    };
  });

  await candidatesDb.candidates.bulkAdd(sampleCandidates);
  console.log(`Seeded ${count} candidates for ${jobIds.length} jobs`);
}

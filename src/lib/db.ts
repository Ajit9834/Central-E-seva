import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPS_FILE = path.join(DATA_DIR, 'applications.json');

export interface StatusEntry {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Application {
  id: string;
  type: string;
  service: string;
  document: string;
  status: string;
  statusHistory: StatusEntry[];
  submittedAt: string;
  data: Record<string, string>;
  applicantName?: string;
  applicantMobile?: string;
  applicantEmail?: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(APPS_FILE)) {
    fs.writeFileSync(APPS_FILE, JSON.stringify({ applications: SEED_DATA }, null, 2));
  }
}

function readAll(): Application[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(APPS_FILE, 'utf-8');
    return JSON.parse(raw).applications as Application[];
  } catch {
    return [];
  }
}

function writeAll(apps: Application[]) {
  ensureDataDir();
  fs.writeFileSync(APPS_FILE, JSON.stringify({ applications: apps }, null, 2));
}

export function getAllApplications(): Application[] {
  return readAll();
}

export function getApplicationById(id: string): Application | null {
  return readAll().find((a) => a.id === id.toUpperCase()) || null;
}

export async function createApplication(app: Application): Promise<Application> {
  const apps = readAll();
  apps.push(app);
  writeAll(apps);
  return app;
}

export function updateApplicationStatus(id: string, status: string, note?: string): boolean {
  const apps = readAll();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  apps[idx].status = status;
  apps[idx].statusHistory.push({ status, timestamp: new Date().toISOString(), note });
  writeAll(apps);
  return true;
}

// ─── Seed data for demo ───────────────────────────────────────────────────────
const SEED_DATA: Application[] = [
  {
    id: 'PAN-2026-DEMO01',
    type: 'PAN Card Application',
    service: 'apply',
    document: 'pan',
    status: 'Dispatched',
    applicantName: 'Arjun Sharma',
    applicantMobile: '9876543210',
    applicantEmail: 'arjun.sharma@example.com',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-03-01T09:00:00Z', note: 'Application received' },
      { status: 'Under Review', timestamp: '2026-03-02T10:30:00Z', note: 'Documents verification in progress' },
      { status: 'Documents Verified', timestamp: '2026-03-04T14:00:00Z', note: 'All documents verified successfully' },
      { status: 'Approved', timestamp: '2026-03-06T11:00:00Z', note: 'Application approved by NSDL' },
      { status: 'Dispatched', timestamp: '2026-03-10T08:00:00Z', note: 'PAN card dispatched via Speed Post. Tracking: EG123456789IN' },
    ],
    submittedAt: '2026-03-01T09:00:00Z',
    data: { firstName: 'Arjun', lastName: 'Sharma', city: 'Mumbai', state: 'Maharashtra' },
  },
  {
    id: 'PSP-2026-DEMO02',
    type: 'Fresh Passport Application',
    service: 'apply',
    document: 'passport',
    status: 'Police Verification Pending',
    applicantName: 'Priya Nair',
    applicantMobile: '9123456789',
    applicantEmail: 'priya.nair@example.com',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-03-05T10:00:00Z', note: 'Application received at Passport Seva Kendra' },
      { status: 'Under Review', timestamp: '2026-03-06T09:00:00Z', note: 'Document verification initiated' },
      { status: 'Documents Verified', timestamp: '2026-03-08T14:00:00Z', note: 'All documents found in order' },
      { status: 'Police Verification Pending', timestamp: '2026-03-09T10:00:00Z', note: 'Application forwarded to local police station for address verification' },
    ],
    submittedAt: '2026-03-05T10:00:00Z',
    data: { givenName: 'Priya', surname: 'Nair', city: 'Kochi', state: 'Kerala' },
  },
  {
    id: 'DL-2026-DEMO03',
    type: "Learner's Driving Licence",
    service: 'apply',
    document: 'driving-license',
    status: 'Test Scheduled',
    applicantName: 'Rahul Verma',
    applicantMobile: '8765432109',
    applicantEmail: 'rahul.verma@example.com',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-03-08T11:00:00Z', note: 'Application received at RTO' },
      { status: 'Under Review', timestamp: '2026-03-09T10:00:00Z', note: 'Documents under verification' },
      { status: 'Test Scheduled', timestamp: '2026-03-11T09:00:00Z', note: 'Learner Licence test scheduled for 2026-03-18 at 10:00 AM at RTO-12, Hyderabad' },
    ],
    submittedAt: '2026-03-08T11:00:00Z',
    data: { fullName: 'Rahul Verma', city: 'Hyderabad', state: 'Telangana' },
  },
];

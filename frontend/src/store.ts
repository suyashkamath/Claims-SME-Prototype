import type { ProductId } from './data/products';

// Prototype-only persistence: claims live in localStorage so "Track a Claim"
// can show what was filed through "Start a Claim".

export type ClaimStatus = 'REGISTERED' | 'DOCS_PENDING' | 'UNDER_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SETTLED';

export interface Claim {
  ticket: string;
  createdAt: string;
  // older saved claims have no productId — treat them as travel
  productId?: ProductId;
  product: string;
  insurerId: string;
  insurerName: string;
  clientName: string;
  policyNumber: string;
  filedWithInsurer: 'Yes' | 'No';
  insurerStatus?: 'UNDER_PROCESS' | 'REJECTED' | 'OTHERS';
  insurerClaimNumber?: string;
  categoryId?: string;
  categoryLabel?: string;
  incidentDate?: string;
  incidentPlace?: string;
  description?: string;
  claimAmount?: string;
  // workmen compensation only
  employeeName?: string;
  employeeAge?: string;
  monthlyWage?: string;
  // others only: who filed it
  filedBy?: 'Insured' | 'Partner';
  // marine only: cargo and bill of lading / air waybill
  shipment?: string;
  // cattle only: type / breed and ear tag
  animal?: string;
  // machinery only
  machineName?: string;
  // group mediclaim only
  claimMode?: 'Cashless' | 'Reimbursement';
  documents: string[];
  status: ClaimStatus;
  // index into the product's process steps reached so far
  stage: number;
}

const KEY = 'sme_travel_claims'; // kept as-is so existing saved claims still load

const SEED: Claim[] = [
  {
    ticket: 'SME-TRV-100231', createdAt: '2026-09-22T10:15:00', product: 'Travel Insurance',
    insurerId: 'tata-aig', insurerName: 'TATA AIG General Insurance', clientName: 'Ankit Mehra',
    policyNumber: 'TRV/2026/558812', filedWithInsurer: 'No', categoryId: 'baggage-delay',
    categoryLabel: 'Delayed or Loss of Check-in Baggage', incidentDate: '2026-09-18', incidentPlace: 'Frankfurt, Germany',
    claimAmount: '42000', documents: [], status: 'UNDER_VERIFICATION', stage: 3,
  },
  {
    ticket: 'SME-TRV-100198', createdAt: '2026-09-02T16:40:00', product: 'Travel Insurance',
    insurerId: 'icici-lombard', insurerName: 'ICICI Lombard General Insurance', clientName: 'Riya Kapoor',
    policyNumber: 'IL-TRV-77120934', filedWithInsurer: 'Yes', insurerStatus: 'UNDER_PROCESS', insurerClaimNumber: 'CLM88231',
    categoryLabel: 'Medical Emergency', incidentDate: '2026-08-27', incidentPlace: 'Bangkok, Thailand',
    claimAmount: '185000', documents: [], status: 'SETTLED', stage: 6,
  },
  {
    ticket: 'SME-WC-204517', createdAt: '2026-09-28T11:05:00', productId: 'workmen', product: 'Workmen Compensation',
    insurerId: 'new-india', insurerName: 'The New India Assurance', clientName: 'Shree Ganesh Fabricators Pvt Ltd',
    policyNumber: 'WC/2026/310457', filedWithInsurer: 'No', categoryId: 'temporary',
    categoryLabel: 'Temporary Disability', incidentDate: '2026-09-24', incidentPlace: 'Bhiwandi plant, Thane',
    employeeName: 'Heena Shaikh', employeeAge: '28', monthlyWage: '16000',
    claimAmount: 'INR 24000', documents: [], status: 'UNDER_VERIFICATION', stage: 4,
  },
  {
    ticket: 'SME-PA-307861', createdAt: '2026-10-01T09:30:00', productId: 'pa', product: 'Personal Accidental',
    insurerId: 'hdfc-ergo', insurerName: 'HDFC ERGO General Insurance', clientName: 'Prakash Jadhav',
    policyNumber: 'PA/2026/884216', filedWithInsurer: 'No', categoryId: 'weekly',
    categoryLabel: 'Weekly Benefit (Temporary Total Disability)', incidentDate: '2026-09-26', incidentPlace: 'Nashik Highway, Thane',
    documents: [], status: 'DOCS_PENDING', stage: 2,
  },
  {
    ticket: 'SME-GPA-411903', createdAt: '2026-10-03T14:20:00', productId: 'gpa', product: 'Group Personal Accidental',
    insurerId: 'tata-aig', insurerName: 'TATA AIG General Insurance', clientName: 'Kulkarni Logistics Pvt Ltd',
    policyNumber: 'GPA/2026/562031', filedWithInsurer: 'No', categoryId: 'disablement',
    categoryLabel: 'Dismemberment / Disablement (PTD / PPD)', incidentDate: '2026-09-29', incidentPlace: 'Chakan warehouse, Pune',
    employeeName: 'Rohit Pawar', documents: [], status: 'UNDER_VERIFICATION', stage: 3,
  },
  {
    ticket: 'SME-GMC-520774', createdAt: '2026-10-05T12:10:00', productId: 'gmc', product: 'Group Mediclaim (GMC)',
    insurerId: 'star-health', insurerName: 'Star Health & Allied Insurance', clientName: 'Deshmukh Textiles Pvt Ltd',
    policyNumber: 'GMC/2026/730118', filedWithInsurer: 'No', claimMode: 'Reimbursement', categoryId: 'indoor-hospitalization',
    categoryLabel: 'Indoor Hospitalization — Hospitalization Claim', incidentDate: '2026-09-30', incidentPlace: 'Ruby Hall Clinic, Pune',
    employeeName: 'Sneha Deshmukh', documents: [], status: 'DOCS_PENDING', stage: 2,
  },
  {
    ticket: 'SME-MCH-618245', createdAt: '2026-10-06T10:45:00', productId: 'machinery', product: 'Machinery Insurance',
    insurerId: 'bajaj-allianz', insurerName: 'Bajaj Allianz General Insurance', clientName: 'Patil Precision Components',
    policyNumber: 'MB/2026/447190', filedWithInsurer: 'No', incidentDate: '2026-10-04', incidentPlace: 'Unit 2, MIDC Satpur, Nashik',
    machineName: 'CNC Vertical Machining Centre – BFW VF30', documents: [], status: 'UNDER_VERIFICATION', stage: 4,
  },
  {
    ticket: 'SME-CTL-702316', createdAt: '2026-10-06T16:05:00', productId: 'cattle', product: 'Cattle Insurance',
    insurerId: 'new-india', insurerName: 'The New India Assurance', clientName: 'Shri Sai Dairy Farm',
    policyNumber: 'CTL/2026/219087', filedWithInsurer: 'No', categoryLabel: 'Death — Disease',
    incidentDate: '2026-10-03', incidentPlace: 'Rahuri, Ahmednagar', animal: 'Cow – HF crossbreed · Tag NIA/48213',
    documents: [], status: 'DOCS_PENDING', stage: 1,
  },
  {
    ticket: 'SME-MAR-813592', createdAt: '2026-10-07T09:20:00', productId: 'marine', product: 'Marine Insurance',
    insurerId: 'icici-lombard', insurerName: 'ICICI Lombard General Insurance', clientName: 'Western Auto Exports',
    policyNumber: 'MAR/2026/905364', filedWithInsurer: 'No', categoryLabel: 'Sea cargo — Goods / Materials',
    incidentDate: '2026-10-02', incidentPlace: 'JNPT, Nhava Sheva', shipment: '120 cartons of auto parts · B/L MAEU238814402',
    documents: [], status: 'UNDER_VERIFICATION', stage: 2,
  },
];

export function loadClaims(): Claim[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      // add seed claims introduced after this browser first saved its claims
      const saved: Claim[] = JSON.parse(raw);
      return [...saved, ...SEED.filter((s) => !saved.some((c) => c.ticket === s.ticket))];
    }
  } catch { /* fall back to seed */ }
  return SEED;
}

export function saveClaim(claim: Claim): void {
  const all = [claim, ...loadClaims()];
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* prototype: ignore */ }
}

export function newTicketNumber(prefix: string): string {
  return prefix + Math.floor(100000 + Math.random() * 900000);
}

// Personal Accident claim process, claim types (benefits) and document
// checklist. The checklist is common across insurance companies.
import type { ClaimCategory, ClaimType, Insurer, ProcessStep } from './types';
import { TRAVEL_INSURERS } from './travel';
import { WC_INSURERS } from './workmen';

export const PA_PROCESS: ProcessStep[] = [
  {
    title: 'Notify Your Insurance Provider',
    detail: 'Report the accident to your insurance company immediately — many insurers have a time limit for reporting claims. You can usually notify them through:',
    points: [
      'A call to their claims hotline number',
      'Their website or mobile app',
      'Email or physical mail (refer to your policy)',
    ],
  },
  {
    title: 'Fill Out the Claim Form',
    detail: 'After informing your insurer, you will get a claim form. Provide detailed information about:',
    points: [
      'How the accident occurred',
      'The injuries you sustained',
      'Any medical treatments you have had',
    ],
  },
  {
    title: 'Gather Supporting Documents',
    detail: 'Your insurer will request proof before attending to your claim. Documents you might need:',
    points: [
      'Medical records and bills',
      'Police reports (if applicable)',
      'Pictures of the injuries or the area of the accident',
      'Witness statements',
    ],
  },
  {
    title: 'Submit Your Claim and Wait for Processing',
    detail: 'Send the completed form and documents to your insurance company. They will analyse your claim and may contact you to request additional information.',
  },
];

export const PA_CLAIM_TYPES: ClaimType[] = [
  { title: 'Accidental Death', icon: 'fa-ribbon', detail: 'Death of the insured due to an accident — the claim is made by the nominee.' },
  { title: 'Permanent Total Disability', icon: 'fa-wheelchair', detail: 'Total disablement such as the loss of both eyes, hands or legs.' },
  { title: 'Permanent Partial Disability', icon: 'fa-crutch', detail: 'Partial disablement such as the loss of one limb or one eye.' },
  { title: 'Temporary Total Disability', icon: 'fa-calendar-week', detail: 'Injuries temporarily prevent the insured from working — claimed as a weekly benefit.' },
  { title: 'Medical Expenses & Ambulance', icon: 'fa-truck-medical', detail: 'Medical expenses and ambulance charges related to the accident, where the policy covers them.' },
];

export const PA_GENERAL_DOCUMENTS: string[] = [
  'Completed claim form',
  'Photocopy of the insurance policy',
  'Medical certificates and bills',
  'Discharge summary (for inpatient claims)',
  'FIR or police report (if there has been an accident)',
  'Identity proof of the claimant',
  'Bank account details for claim settlement',
];

export type PaKind = 'weekly' | 'death' | 'disablement' | 'medical';

const DOCTOR_REPORT = 'Attending doctor’s report';
const DISABILITY_CERT = 'Original disability certificate from the doctor, if any';
const LAB_REPORTS = 'Investigation / lab reports (X-ray reports with films & other reports)';
const ADMISSION_CARD = 'Original admission / discharge card, if hospitalised';
const INQUEST = 'Police inquest report, where applicable';

export const PA_CATEGORIES: (ClaimCategory & { id: PaKind })[] = [
  {
    id: 'weekly', label: 'Weekly Benefit (Temporary Total Disability)', icon: 'fa-calendar-week',
    documents: [
      DOCTOR_REPORT,
      DISABILITY_CERT,
      'Fitness certificate from the doctor',
      LAB_REPORTS,
      ADMISSION_CARD,
      'Employer’s leave certificate with grade / designation',
    ],
  },
  {
    id: 'death', label: 'Death', icon: 'fa-ribbon',
    documents: [
      DOCTOR_REPORT,
      'Original death certificate',
      'Report on cause of death',
      'Original / attested post mortem / coroner’s report',
      'Attested copy of FIR / panchnama',
      INQUEST,
    ],
  },
  {
    id: 'disablement', label: 'Dismemberment / Disablement (PTD / PPD)', icon: 'fa-wheelchair',
    documents: [
      DOCTOR_REPORT,
      DISABILITY_CERT,
      LAB_REPORTS,
      ADMISSION_CARD,
      INQUEST,
      'In case of PTD claims – disability certificate from Govt. registered medical practitioners',
    ],
  },
  {
    id: 'medical', label: 'Medical Expenses & Ambulance', icon: 'fa-truck-medical',
    documents: [
      ADMISSION_CARD,
      'Original hospital / medical bills with payment receipts',
      'Ambulance bill / receipt',
    ],
  },
];

// PA is sold by general insurers and standalone health insurers.
export const PA_INSURERS: Insurer[] = [
  ...WC_INSURERS,
  TRAVEL_INSURERS.find((i) => i.id === 'care')!,
  { id: 'star-health', name: 'Star Health and Allied Insurance', phone: '1800-425-2255', email: 'support@starhealth.in', website: 'www.starhealth.in' },
  { id: 'niva-bupa', name: 'Niva Bupa Health Insurance', phone: '1860-500-8888', email: 'customercare@nivabupa.com', website: 'www.nivabupa.com' },
];

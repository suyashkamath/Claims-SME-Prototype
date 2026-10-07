// Group Mediclaim (GMC) claim guide. Process, checklists, claim categories and
// insurer list are copied from the Health product of the ClaimManagement
// project (claim-portal + health-claim-form components).
import type { ClaimCategory, Insurer, ProcessStep } from './types';

export const GMC_PROCESS: ProcessStep[] = [
  { title: 'Intimation', detail: 'Intimation is mandatory and can be done via email, toll free number or by visiting the insurer website. Must be done 24 hours before admission or at the time of hospitalization.' },
  { title: 'Registration', detail: 'Register the claim via the insurer application or insurer website, or submit original documents at the nearest insurer branch.' },
  {
    title: 'Documents Checklist',
    detail: 'Keep these documents ready:',
    points: [
      'Claim form',
      'CKYC form (if claim amount ≥ ₹1 lakh)',
      'Discharge summary',
      'Final consolidated bill',
      'Lab reports',
      'ICP (Indoor case paper)',
      'Medicine prescription',
      'Payment receipts (bill / lab / pharmacy)',
      'PAN card & Aadhaar card of patient',
      'Cancelled cheque of policy holder',
    ],
  },
  { title: 'Submission TAT', detail: 'All documents must be submitted within 30 days of discharge from the hospital.' },
  { title: 'Payment TAT', detail: 'Payment is released within 7 to 10 working days after document approval.' },
];

export const GMC_GENERAL_DOCUMENTS: string[] = [
  'Claim Form',
  'CKYC Form (required if claim amount is ≥ ₹1 lakh)',
  'Discharge Summary',
  'Final Consolidated Bill',
  'Lab Reports',
  'ICP (Indoor Case Paper)',
  'Medicine Prescription',
  'Payment Receipts (final bill, lab reports, pharmacy bills)',
  'PAN Card & Aadhaar Card of Patient',
  'Cancelled Cheque of Policy Holder',
];

export type ClaimMode = 'Cashless' | 'Reimbursement';
export const CLAIM_MODES: ClaimMode[] = ['Cashless', 'Reimbursement'];

export const HEALTH_SUB_CATEGORIES: Record<string, string[]> = {
  'Indoor Hospitalization': ['Hospitalization Claim', 'Pre Hospitalization', 'Post Hospitalization'],
  'Travel Claims (Domestic/International)': ['Indoor Hospitalization Claim', 'Travel Others Claim', 'Outpatient Claim'],
};

export const ROOM_TYPES = ['General Ward', 'Semi-Private', 'Private', 'Suite', 'ICU'];

// key is "category" or "category|subCategory"
const CASHLESS_DOCS: Record<string, string[]> = {
  'Personal Accident': [
    'Claim Form', 'Pre-Authorization Letter', 'FIR / MLC Certificate',
    'Doctor Certificate', 'PAN Card', 'Aadhaar Card',
  ],
  'Indoor Hospitalization': [
    'Claim Form', 'Pre-Authorization / Cashless Approval Letter',
    'Discharge Summary', 'Final Hospital Bill', 'PAN Card',
  ],
  'Indoor Hospitalization|Hospitalization Claim': [
    'Claim Form', 'CKYC Form (if claim ≥ ₹1 lakh)',
    'Cashless / Pre-Authorization Approval Letter', 'Discharge Summary',
    'Final Hospital Bill', 'Lab Reports', 'ICP (Indoor Case Paper)',
    'Medicine Prescription', 'PAN Card', 'Aadhaar Card',
  ],
  'Indoor Hospitalization|Pre Hospitalization': [
    'Claim Form', 'Doctor Prescription (pre-admission)',
    'Diagnostic Reports', 'Pharmacy Bills (within 30 days prior to admission)',
  ],
  'Indoor Hospitalization|Post Hospitalization': [
    'Claim Form', 'Discharge Summary', 'Doctor Prescription (follow-up)',
    'Diagnostic Reports', 'Follow-up Bills (within 60 days of discharge)',
  ],
  'Daily Cash Allowance / Emi Benefit': [
    'Claim Form', 'Pre-Authorization Letter',
    'Hospital Admission Proof', 'Discharge Summary',
  ],
  'Outpatient': [
    'Claim Form', 'Cashless OPD Approval Letter',
    'Doctor Prescription', 'Diagnostic Reports',
  ],
  'Travel Claims (Domestic/International)': [
    'Claim Form', 'Pre-Authorization Letter',
    'Boarding Passes', 'Passport Copy',
  ],
  'Travel Claims (Domestic/International)|Indoor Hospitalization Claim': [
    'Claim Form', 'Pre-Authorization Letter', 'Boarding Passes',
    'Discharge Summary', 'Hospital Bills', 'Passport Copy',
  ],
  'Travel Claims (Domestic/International)|Travel Others Claim': [
    'Claim Form', 'Boarding Passes', 'Passport Copy',
    'PIR from Airline (for baggage claims)', 'Travel Assistance Approval Letter',
  ],
  'Travel Claims (Domestic/International)|Outpatient Claim': [
    'Claim Form', 'Boarding Passes', 'Passport Copy',
    'Cashless OPD Approval Letter', 'Doctor Prescription',
  ],
  'Critical Illness': [
    'Claim Form', 'Pre-Authorization Letter',
    'Critical Illness Diagnosis Report', 'Doctor Certificate',
    'Hospital Bills', 'PAN Card', 'Aadhaar Card',
  ],
};

const REIMBURSEMENT_DOCS: Record<string, string[]> = {
  'Personal Accident': [
    'Claim Form', 'Policy Document', 'FIR / MLC Certificate',
    'Doctor Certificate', 'Original Hospital Bills', 'Discharge Summary',
    'Payment Receipts (Bill, Lab, Pharmacy)', 'PAN Card', 'Aadhaar Card',
    'Cancelled Cheque of Policy Holder',
  ],
  'Indoor Hospitalization': [
    'Claim Form', 'Discharge Summary', 'Original Hospital Bills',
    'Payment Receipts', 'PAN Card', 'Cancelled Cheque of Policy Holder',
  ],
  'Indoor Hospitalization|Hospitalization Claim': [
    'Claim Form', 'CKYC Form (if claim ≥ ₹1 lakh)', 'Discharge Summary',
    'Final Consolidated Bill (original)', 'Lab Reports (original)',
    'ICP (Indoor Case Paper)', 'Medicine Prescription (original)',
    'Payment Receipts (Bill, Lab, Pharmacy)',
    'PAN Card & Aadhaar Card of Patient', 'Cancelled Cheque of Policy Holder',
  ],
  'Indoor Hospitalization|Pre Hospitalization': [
    'Claim Form', 'Doctor Prescription (original)',
    'Diagnostic Reports (original)',
    'Bills for Medicines & Tests (within 30 days prior to admission)', 'PAN Card',
  ],
  'Indoor Hospitalization|Post Hospitalization': [
    'Claim Form', 'Discharge Summary',
    'Doctor Prescription — follow-up (original)',
    'Diagnostic Reports — follow-up (original)',
    'Follow-up Bills (original, within 60 days of discharge)', 'PAN Card',
  ],
  'Daily Cash Allowance / Emi Benefit': [
    'Claim Form', 'Original Hospital Bills', 'Discharge Summary',
    'Doctor Certificate', 'Cancelled Cheque of Policy Holder',
  ],
  'Outpatient': [
    'Claim Form', 'Doctor Prescription (original)',
    'Original Consultation Bills', 'Diagnostic Reports (original)',
    'Payment Receipts', 'Cancelled Cheque of Policy Holder',
  ],
  'Travel Claims (Domestic/International)': [
    'Claim Form', 'Boarding Passes', 'Passport Copy',
    'Original Medical Bills / Receipts',
  ],
  'Travel Claims (Domestic/International)|Indoor Hospitalization Claim': [
    'Claim Form', 'Boarding Passes', 'Discharge Summary',
    'Original Medical Bills', 'Hospital Reports',
    'Payment Receipts', 'Passport Copy', 'Cancelled Cheque',
  ],
  'Travel Claims (Domestic/International)|Travel Others Claim': [
    'Claim Form', 'Boarding Passes', 'Passport Copy',
    'PIR from Airline (for baggage claims)',
    'Original Receipts', 'Trip Cancellation Proof (if applicable)',
  ],
  'Travel Claims (Domestic/International)|Outpatient Claim': [
    'Claim Form', 'Boarding Passes', 'Passport Copy',
    'Doctor Prescription (original)', 'Original Consultation Bills',
    'Payment Receipts',
  ],
  'Critical Illness': [
    'Claim Form', 'Policy Document', 'Critical Illness Diagnosis Report',
    'Doctor Certificate', 'Original Hospital Bills', 'Payment Receipts',
    'PAN Card', 'Aadhaar Card', 'Cancelled Cheque of Policy Holder',
  ],
};

export const GMC_REJECTED_DOCS = ['Rejection Form / Letter', 'Policy Copy', 'Claim Form', 'PAN Card', 'Aadhaar Card'];

export function gmcDocuments(mode: ClaimMode, category: string, subCategory: string): string[] {
  const docsMap = mode === 'Reimbursement' ? REIMBURSEMENT_DOCS : CASHLESS_DOCS;
  const compositeKey = subCategory ? `${category}|${subCategory}` : category;
  return docsMap[compositeKey] || docsMap[category] || ['Claim Form', 'Policy Document', 'PAN Card', 'Aadhaar Card'];
}

const CATEGORY_ICONS: Record<string, string> = {
  'Personal Accident': 'fa-user-injured',
  'Indoor Hospitalization': 'fa-hospital',
  'Daily Cash Allowance / Emi Benefit': 'fa-money-bill-wave',
  'Outpatient': 'fa-stethoscope',
  'Travel Claims (Domestic/International)': 'fa-plane',
  'Critical Illness': 'fa-heart-pulse',
};

// The guide's accordion lists each category's reimbursement + cashless checklist.
export const GMC_CATEGORIES: ClaimCategory[] = Object.entries(CATEGORY_ICONS).map(([label, icon]) => ({
  id: label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
  label,
  icon,
  documents: REIMBURSEMENT_DOCS[label],
  cashlessDocuments: CASHLESS_DOCS[label],
}));

export const GMC_INSURERS: Insurer[] = [
  { id: 'star-health', name: 'Star Health & Allied Insurance', phone: '1800-425-2255', email: 'support@starhealth.in', website: 'www.starhealth.in/claims',
    tip: 'For reimbursement claims, submit all original documents to Star Health within 30 days of discharge.' },
  { id: 'care-health', name: 'Care Health Insurance', phone: '18001024488 / 18001026655', email: 'customerfirst@careinsurance.com', website: 'www.careinsurance.com/rhicl/claim/login',
    tip: 'File claims online via the Care Health portal for faster reimbursement.' },
  { id: 'hdfc-ergo-health', name: 'HDFC ERGO General Insurance', phone: '7304524888', email: 'healthclaims@hdfcergo.com', website: 'customersupport.hdfcergo.com/customer-care/claim-registration.html',
    tip: 'Register for the HDFC ERGO app to get cashless approval in real time.' },
  { id: 'icici-lombard-health', name: 'ICICI Lombard General Insurance', phone: '1800-2666', email: 'customersupport@icicilombard.com', website: 'ilhc.icicilombard.com',
    tip: 'Download IL TakeCare app for 24/7 health support and claim filing.' },
  { id: 'manipal-cigna', name: 'Manipal Cigna Health Insurance', phone: '1800-102-4462', email: 'customercare@manipalcigna.com', website: 'www.manipalcigna.com/claims',
    tip: 'Visit manipalcigna.com/claims for a complete checklist of documents.' },
  { id: 'indusind-health', name: 'Reliance / IndusInd General Insurance', phone: '2248903009', email: 'rgicl.services@relianceada.com', website: 'www.reliancegeneral.co.in/Insurance/Profile/MyClaim.aspx',
    tip: 'Keep all original documents handy for smooth claim processing.' },
  { id: 'bajaj-health', name: 'Bajaj Allianz General Insurance', phone: '1800-209-5858', email: 'careforyou@bajajgeneral.com', website: 'www.bajajgeneralinsurance.com/health-insurance-plans/health-insurance-claim-process.html',
    tip: 'Hospital submits the pre-auth digitally — first decision comes within 60 minutes of form submission.' },
  { id: 'future-generali-health', name: 'Future Generali India Insurance', phone: '1800-103-8889', email: 'fgh@futuregenerali.in', website: 'general.futuregenerali.in/health-claim-intimation',
    tip: 'File your health claim online at general.futuregenerali.in for quick processing.' },
  { id: 'iffco-tokio-health', name: 'IFFCO Tokio General Insurance', phone: '1800-103-5499', email: 'healthclaims@iffcotokio.co.in', website: 'iffcotokioindia.co.in',
    tip: "For cashless, ensure the hospital is in IFFCO Tokio's network list before admission." },
  { id: 'liberty-health', name: 'Liberty General Insurance', phone: '1800-102-7477', email: 'claims@vipulmedcorp.com', website: 'www.libertyinsurance.in/products/claims/health-claims',
    tip: 'Download Liberty Insurance app for quicker claim filing and tracking.' },
  { id: 'royal-sundaram-health', name: 'Royal Sundaram General Insurance', phone: '1860-258-0000', email: 'customer.services@royalsundaram.in', website: 'www.royalsundaram.in/health-claims',
    tip: 'Visit royalsundaram.in to view your network hospital list.' },
  { id: 'tata-aig-health', name: 'TATA AIG General Insurance', phone: '022-6489-8282', email: 'customersupport@tataaig.com', website: 'www.tataaig.com/claims-process',
    tip: 'For non-network hospitals, SMS "GetCashless" to 7428192242 — TATA AIG will verify and issue an authorization letter.' },
  { id: 'sbi-general-health', name: 'SBI General Insurance', phone: '1800-22-1111', email: 'customer.care@sbigeneral.in', website: 'www.sbigeneral.in/portal/claim/claims-intimation',
    tip: 'You can also submit health claims online at sbigeneral.in.' },
  { id: 'go-digit-health', name: 'Go Digit General Insurance', phone: '1800-258-4242', email: 'healthclaims@godigit.com', website: 'www.godigit.com/health-insurance/file-a-claim',
    tip: 'For non-network cashless, email with diagnosis reports and health E-card attached — Digit processes it digitally.' },
  { id: 'cholamandalam-health', name: 'Cholamandalam MS General Insurance', phone: '1800-208-9100', email: 'customercare@cholams.murugappa.com', website: 'www.cholamandalam.com',
    tip: 'WhatsApp 7305234433 for quick claim assistance from Cholamandalam.' },
  { id: 'new-india-health', name: 'New India Assurance', phone: '1800-209-1415', email: '331200@newindia.co.in', website: 'www.newindia.co.in',
    tip: 'Visit the nearest New India branch for direct claim submission assistance.' },
  { id: 'niva-bupa', name: 'Niva Bupa Health Insurance', phone: '1860-500-8888', email: 'healthclaims@nivabupa.com', website: 'www.nivabupa.com/claims',
    tip: 'Use the Niva Bupa app or website to file claims and track status in real time.' },
  { id: 'magma-hdi-health', name: 'Magma HDI General Insurance', phone: '1800-419-5959', email: 'customercare@magmahdi.com', website: 'www.magmahdi.com',
    tip: 'Contact Magma HDI customer care for cashless approval at network hospitals.' },
  { id: 'kotak-health', name: 'Kotak Mahindra General Insurance', phone: '1800-266-4545', email: 'customersupport@kotakgeneral.com', website: 'www.kotakgeneral.com',
    tip: 'Reach out to Kotak General customer care for network hospital assistance.' },
  { id: 'national-health', name: 'National Insurance Company', phone: '1800-345-0330', email: 'customercare@nationalinsurance.nic.co.in', website: 'www.nationalinsurance.nic.co.in',
    tip: 'Visit your nearest National Insurance branch for cashless hospital tie-up verification.' },
  { id: 'universal-sompo-health', name: 'Universal Sompo General Insurance', phone: '1800-200-5142', email: 'customercare@universalsompo.com', website: 'www.universalsompo.com',
    tip: 'Universal Sompo has a wide network of hospitals — confirm cashless facility before admission.' },
  { id: 'raheja-qbe-health', name: 'Raheja QBE General Insurance', phone: '1800-102-7723', email: 'customerservice@rahejaQBE.com', website: 'www.rahejaqbe.com',
    tip: 'Contact Raheja QBE for cashless pre-authorization at empanelled hospitals.' },
  { id: 'zuno-health', name: 'Zuno General Insurance (Edelweiss)', phone: '1800-1200-004', email: 'hello@zuno.co.in', website: 'www.zuno.co.in',
    tip: 'Zuno offers a seamless digital claim process — file online for faster settlement.' },
  { id: 'uiic-health', name: 'United India Insurance (UIIC)', phone: '1800-425-3333', email: 'customercare@uiic.co.in', website: 'www.uiic.co.in',
    tip: 'Submit claims at your nearest United India branch or through their TPA for cashless treatment.' },
  { id: 'aditya-birla-health', name: 'Aditya Birla Health Insurance', phone: '1800-270-7000', email: 'customercare@adityabirlacapital.com', website: 'www.adityabirlahealthinsurance.com',
    tip: 'Activate the Activ Health app for wellness rewards and seamless claim filing.' },
  { id: 'oriental-health', name: 'Oriental Insurance Company', phone: '1800-118-485', email: 'customerservice@orientalinsurance.org.in', website: 'www.orientalinsurance.org.in',
    tip: 'Visit your nearest Oriental Insurance branch for claim submission and tracking.' },
  { id: 'navi-health', name: 'Navi General Insurance', phone: '1800-123-0004', email: 'insurance.help@navi.com', website: 'www.navi.com',
    tip: 'File health claims entirely through the Navi app — no physical paperwork required.' },
  { id: 'acko-health', name: 'Acko General Insurance', phone: '1800-266-2256', email: 'support@acko.com', website: 'www.acko.com',
    tip: 'Acko is fully digital — file and track claims via the Acko app for the fastest experience.' },
  { id: 'shriram-health', name: 'Shriram General Insurance', phone: '1800-300-30000', email: 'customercare@shriramgi.com', website: 'www.shriramgi.com',
    tip: 'Visit the nearest Shriram branch or call customer care for health claim assistance.' },
];

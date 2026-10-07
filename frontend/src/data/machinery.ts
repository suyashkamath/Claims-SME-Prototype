// Machinery (breakdown) insurance claim process and document checklist.
import type { DocumentInfo, ProcessStep } from './types';

export const MACHINERY_INTRO =
  'When a machine breaks down, act fast: secure the site, document everything, notify the insurer within 24 hours, and submit all required paperwork. Quick, accurate steps reduce disputes and speed up settlement, keeping production and cash flow on track.';

export const MACHINERY_PROCESS: ProcessStep[] = [
  {
    title: 'Secure the Equipment and the Site',
    detail: 'Prevent further damage immediately. This initial evidence forms the backbone of the insurer’s technical assessment.',
    points: [
      'Switch off power and isolate the faulty unit',
      'Arrange temporary protection to stop water ingress, fire spread or contamination',
      'Photograph the scene, the damaged parts and any safety signs that were in place',
      'Record the exact time of failure, the operating conditions and the personnel present',
    ],
  },
  {
    title: 'Notify the Insurer Without Delay',
    detail: 'Most policies require notice within 24 hours of the incident — your policy wording spells out the exact window.',
    points: [
      'Call the claim helpline with the policy number, a brief description of the event and the location',
      'Ask for the claim reference number and the name of the claim handler assigned to you',
      'Follow the call with a written notice (email or registered post) repeating the details, with the photographs attached',
    ],
  },
  {
    title: 'Inform Internal Stakeholders',
    detail: 'Keeping everyone aligned prevents contradictory actions that could jeopardise the claim. Inform them in this order:',
    points: [
      'Plant manager / operations head — coordinate shutdown and arrange a temporary replacement if feasible',
      'Finance team — freeze pending payments related to the damaged asset and prepare for the claim receipt',
      'Legal / compliance officer — especially if the breakdown may trigger contractual penalties',
    ],
  },
  {
    title: 'Gather the Mandatory Documents',
    detail: 'Collect the documents the insurer will request (see the checklist below). The insurer may also ask for a loss quantification report by a qualified engineer, listing the cost of repair vs replacement, the downtime loss and ancillary expenses such as freight or installation.',
  },
  {
    title: 'Prepare for the Surveyor’s Visit',
    detail: 'The insurer sends a technical surveyor who checks the site for tampering or negligence — a missing safety guard or an unauthorised modification can trigger a denial or a reduced payout. Their checklist focuses on:',
    points: [
      'Evidence of proper maintenance',
      'Proof that the failure was sudden and accidental',
      'Verification that the machine was not overloaded or operated beyond its rated capacity',
      'Keep the complete maintenance log, the operating manual and recent calibration certificates on hand',
    ],
  },
  {
    title: 'Avoid Common Pitfalls',
    detail: 'These mistakes commonly lead to a reduced claim:',
    points: [
      'Submitting an estimate from an unauthorised repair shop — use approved service centres or certified contractors',
      'Not disclosing prior minor breakdowns — the insurer may invoke the average clause',
      'Underinsurance — the waiver applies only up to a 15% shortfall; if the sum insured is below 85% of current market value, the claim is reduced proportionally',
      'Keep the sum insured at the latest replacement cost, not the historic purchase price',
    ],
  },
  {
    title: 'Review the Surveyor’s Report',
    detail: 'The report outlines the cause of failure and any deductions. If you disagree, request clarification in writing and submit a third-party expert’s opinion with supporting data — the insurer must consider reasonable counter-evidence before finalising the settlement.',
  },
];

export const MACHINERY_DOCUMENT_INFO: Record<string, DocumentInfo> = {
  'Policy Schedule': { purpose: 'Proof of coverage', source: 'Insurance company' },
  'Maintenance Log': { purpose: 'Shows regular servicing', source: 'Company records' },
  'Purchase Order': { purpose: 'Confirms purchase details', source: 'Supplier' },
  'Warranty Certificate': { purpose: 'Validates warranty status', source: 'Manufacturer' },
  'Electricity Bill': { purpose: 'Supports surge claim', source: 'Utility provider' },
  'Photographs': { purpose: 'Evidence of damage', source: 'Photographer or employee' },
};

export const MACHINERY_GENERAL_DOCUMENTS = Object.keys(MACHINERY_DOCUMENT_INFO);

// Further documents named in the process that the insurer may ask for.
export const MACHINERY_EXTRA_DOCUMENTS = {
  title: 'The insurer may also ask for',
  documents: [
    'Latest renewal certificate',
    'Detailed invoice of the machine',
    'Surge-protection device reports (if the breakdown was due to a power surge)',
    'Loss quantification report by a qualified engineer',
    'Operating manual',
    'Recent calibration certificates',
  ],
};

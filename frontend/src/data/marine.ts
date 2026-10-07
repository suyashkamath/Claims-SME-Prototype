// Marine (cargo) insurance claim process and document checklist.
import type { ProcessStep } from './types';

export const MARINE_INTRO =
  'Marine insurance covers loss or damage of ships, cargo, terminals and other transport-related property against perils during transportation. The settlement process can be complex — if the insurer disputes the claim or offers a lower amount, the policyholder may need legal advice or mediation to resolve it.';

export const MARINE_PROCESS: ProcessStep[] = [
  {
    title: 'Notification of Loss',
    detail: 'Inform the insurer as soon as possible after the incident, with all relevant details:',
    points: ['Date and time of the incident', 'Location', 'Nature of the damage or loss'],
  },
  {
    title: 'Documentation and Assessment',
    detail: 'Provide photographs or videos of the damage and any other relevant evidence. Thorough and accurate documentation is essential for the assessment of the claim.',
  },
  {
    title: 'Survey and Assessment',
    detail: 'The insurer appoints a marine surveyor to investigate the circumstances, inspect the damaged goods or vessel and give an independent assessment. The surveyor’s report is a critical factor in determining the validity of the claim.',
  },
  {
    title: 'Claim Review',
    detail: 'The claims department reviews the documents and the surveyor’s report against the policy terms and conditions. If the claim is valid and within coverage, it moves to the next step.',
  },
  {
    title: 'Quantification of Loss',
    detail: 'The insurer calculates the compensation owed — the cost of repairing or replacing damaged goods, plus associated costs such as transportation expenses or additional charges incurred due to the loss.',
  },
  {
    title: 'Settlement Offer',
    detail: 'The insurer makes a formal settlement offer stating the amount and its terms and conditions. The insured can either accept or negotiate the offer.',
  },
];

export const MARINE_CHECKLIST_NOTE = 'Submit the following documents to the insurer’s local settling agent in order to receive payment.';

export const MARINE_DOCUMENTS = {
  policy: 'Original Policy or Certificate of Insurance',
  bl: 'Original Bill of Lading or Air Waybill (as applicable)',
  invoice: 'Copy of Invoice and Packing List or Weight Note',
  notice: 'Notice of claim against Carriers, Port Authority, Forwarder and their replies on liability',
  survey: 'Port Inward and Outward Survey Report or Airlines Discrepancy / Damage Report (as applicable)',
  deliveryOrder: 'Forwarder’s Delivery Order (if available)',
  receipts: 'Delivery Receipts such as Carriers’ Loading and Discharge Tally Sheets, Containers’ Stuffing and Un-stuffing Tally Records',
  customs: 'Custom Declaration Form (if available)',
  qc: 'QC Report on extent of damages and quantities affected (applicable for materials, semi-finished and finished goods)',
  technical: 'Technical / Damage Report on extent of damages (applicable for machinery)',
  repair: 'Repair / Replacement Bill(s) where applicable',
  claimBill: 'Claim Bill less salvage',
  additional: 'Any additional information and documentary evidence as may be required by the insurer and surveyors',
};

export const MARINE_GENERAL_DOCUMENTS = Object.values(MARINE_DOCUMENTS);

export type MarineMode = 'Sea' | 'Air';
export type MarineCargo = 'Goods / Materials' | 'Machinery';

// Upload list for the claim wizard: the "as applicable" documents resolved
// for the shipment; optional ("if available", "where applicable") ones are
// left to the guide's checklist.
export function marineDocuments(mode: MarineMode | '', cargo: MarineCargo | ''): string[] {
  const d = MARINE_DOCUMENTS;
  return [
    d.policy,
    mode === 'Air' ? 'Original Air Waybill' : mode === 'Sea' ? 'Original Bill of Lading' : d.bl,
    d.invoice,
    d.notice,
    mode === 'Air' ? 'Airlines Discrepancy / Damage Report' : mode === 'Sea' ? 'Port Inward and Outward Survey Report' : d.survey,
    d.receipts,
    ...(cargo === 'Machinery' ? [d.technical] : cargo ? [d.qc] : []),
    d.claimBill,
  ];
}

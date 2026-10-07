// Cattle insurance claim process, exclusions and document checklist.
// Source text is Bajaj General's cattle insurance page, generalised so it
// reads correctly for every insurer.
import type { ProcessStep } from './types';

export const CATTLE_INTRO =
  'Cattle insurance protects farmers from financial losses when illness, accidents or natural disasters affect their cattle. It typically covers medical expenses for sick animals or compensates for the loss of a deceased animal.';

export const CATTLE_PROCESS: ProcessStep[] = [
  {
    title: 'Swift Notification',
    detail: 'Inform the insurer promptly. Claim registration can be done through the insurer’s website, chatbot or app, or directly with their customer care executives.',
  },
  {
    title: 'Document Confirmation',
    detail: 'Obtain a death certificate or a disability certificate from a qualified veterinary practitioner as evidence.',
  },
  {
    title: 'Document Submission',
    detail: 'Beneficiaries complete and submit the claim form along with the required death or disability certificates.',
  },
  {
    title: 'On-Site Validation and Claim Verdict',
    detail: 'An authorised representative of the insurer may visit the site, if required, to validate the submitted information — as per the policy terms or specific arrangements agreed upon.',
    points: [
      'Upon genuine verification, the beneficiary receives the claim amount',
      'If found invalid, the claim is declined',
    ],
  },
];

export const CATTLE_EXCLUSIONS = {
  items: [
    'Injuries or neglect caused intentionally, or due to unskillful treatment or use without the company’s consent',
    'Accidents or diseases occurring before the policy’s start',
    'War, invasion, civil unrest, rebellion, terrorism, intentional slaughter, etc. — unless for humane reasons or by lawful order',
    'Loss or damage caused intentionally by the insured',
    'Transportation by air and sea, and beyond specified distances',
    'Death due to specific diseases, ionising radiation, theft or clandestine sale',
    'Partial disability, death from diseases within 15 days, and consequential losses',
    'Specific exclusions for sheep and goats — coverage is possible with successful inoculation and veterinary certificates',
    'Death due to pleuropneumonia',
  ],
  note: 'The burden of proving covered claims lies with the insured. Exclusions apply as per the insurer’s cattle and livestock policy wording.',
};

export const CATTLE_DOCUMENTS = {
  claimForm: 'Completed claim form',
  tags: 'Identification tags of insured cattle',
  kyc: 'PAN / Form 60 and KYC documents',
  cheque: 'Insured cancelled cheque (non-hypothecation cases)',
  deathCert: 'Attested death certificate by authorised veterinary doctor',
  postMortem: 'Post-mortem report by authorised veterinary doctor',
  photos: 'Minimum 10 photos of the deceased animal',
  hypothecation: 'Bank hypothecation letter with identification tag (if required)',
  tagPhotos: 'Clear photographs showing the tag number',
  treatment: 'Treatment papers for deaths due to disease',
  fir: 'FIR, spot panchnama and police closing report (for vehicular accidents)',
  additional: 'Any additional documents for special conditions',
};

export const CATTLE_GENERAL_DOCUMENTS = Object.values(CATTLE_DOCUMENTS);

// Process step 2: disability claims are backed by a vet's disability certificate.
export const CATTLE_DISABILITY_CERT = 'Disability certificate from a qualified veterinary practitioner';

export type CattleClaimKind = 'Death' | 'Disability';
export type CattleCause = 'Disease' | 'Vehicular accident' | 'Other accident';

// Upload list for the claim wizard, trimmed to the documents that apply.
export function cattleDocuments(kind: CattleClaimKind, cause: CattleCause | '', hypothecated: boolean): string[] {
  const d = CATTLE_DOCUMENTS;
  return [
    d.claimForm,
    d.tags,
    d.kyc,
    hypothecated ? d.hypothecation : d.cheque,
    ...(kind === 'Death' ? [d.deathCert, d.postMortem, d.photos] : [CATTLE_DISABILITY_CERT]),
    d.tagPhotos,
    ...(cause === 'Disease' && kind === 'Death' ? [d.treatment] : []),
    ...(cause === 'Vehicular accident' ? [d.fir] : []),
  ];
}

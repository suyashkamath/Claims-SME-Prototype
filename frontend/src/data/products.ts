import type { ClaimCategory, ClaimType, DocumentInfo, Insurer, ProcessStep } from './types';
import {
  MACHINERY_DOCUMENT_INFO, MACHINERY_EXTRA_DOCUMENTS, MACHINERY_GENERAL_DOCUMENTS, MACHINERY_INTRO, MACHINERY_PROCESS,
} from './machinery';
import { CATTLE_EXCLUSIONS, CATTLE_GENERAL_DOCUMENTS, CATTLE_INTRO, CATTLE_PROCESS } from './cattle';
import { MARINE_CHECKLIST_NOTE, MARINE_GENERAL_DOCUMENTS, MARINE_INTRO, MARINE_PROCESS } from './marine';
import { GMC_CATEGORIES, GMC_GENERAL_DOCUMENTS, GMC_INSURERS, GMC_PROCESS } from './gmc';
import { PA_CATEGORIES, PA_CLAIM_TYPES, PA_GENERAL_DOCUMENTS, PA_INSURERS, PA_PROCESS } from './pa';
import { CLAIM_CATEGORIES, GENERAL_DOCUMENTS, TRAVEL_INSURERS, TRAVEL_PROCESS } from './travel';
import { WC_CATEGORIES, WC_GENERAL_DOCUMENTS, WC_INSURERS, WC_PROCESS } from './workmen';

export interface SmeProduct {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

// Products under SME. Travel, Workmen Compensation, Personal Accidental, Group Personal Accidental, Group Mediclaim, Machinery, Cattle and Marine are wired; Others lets the user enter the policy themselves up in this prototype.
export const SME_PRODUCTS: SmeProduct[] = [
  { id: 'travel', label: 'Travel Insurance', icon: 'fa-plane', enabled: true },
  { id: 'workmen', label: 'Workmen Compensation', icon: 'fa-helmet-safety', enabled: true },
  { id: 'pa', label: 'Personal Accidental', icon: 'fa-user-injured', enabled: true },
  { id: 'gpa', label: 'Group Personal Accidental', icon: 'fa-users', enabled: true },
  { id: 'gmc', label: 'Group Mediclaim (GMC)', icon: 'fa-hospital-user', enabled: true },
  { id: 'machinery', label: 'Machinery Insurance', icon: 'fa-gears', enabled: true },
  { id: 'cattle', label: 'Cattle Insurance', icon: 'fa-cow', enabled: true },
  { id: 'marine', label: 'Marine Insurance', icon: 'fa-ship', enabled: true },
  { id: 'others', label: 'Others', icon: 'fa-ellipsis', enabled: true },
];

export type ProductId = 'travel' | 'workmen' | 'pa' | 'gpa' | 'gmc' | 'machinery' | 'cattle' | 'marine' | 'others';

// Everything the guide / wizard / tracker need to know about a product.
export interface ProductConfig {
  id: ProductId;
  label: string;
  short: string; // used in sentences: "file your travel claim"
  icon: string;
  ticketPrefix: string;
  policyPlaceholder: string;
  intro?: string; // shown above the process steps
  process: ProcessStep[];
  exclusions?: { items: string[]; note?: string }; // shown with the process steps
  generalDocuments: string[];
  checklistNote?: string; // shown above the document checklist
  documentInfo?: Record<string, DocumentInfo>; // renders the general documents as a table
  extraDocuments?: { title: string; documents: string[] };
  categories: ClaimCategory[];
  claimTypes?: ClaimType[];
  insurers: Insurer[];
}

export const PRODUCT_CONFIGS: Record<ProductId, ProductConfig> = {
  travel: {
    id: 'travel', label: 'Travel Insurance', short: 'travel', icon: 'fa-plane', ticketPrefix: 'SME-TRV-',
    policyPlaceholder: 'e.g. TRV/2026/123456',
    process: TRAVEL_PROCESS, generalDocuments: GENERAL_DOCUMENTS, categories: CLAIM_CATEGORIES, insurers: TRAVEL_INSURERS,
  },
  workmen: {
    id: 'workmen', label: 'Workmen Compensation', short: 'workmen compensation', icon: 'fa-helmet-safety', ticketPrefix: 'SME-WC-',
    policyPlaceholder: 'e.g. WC/2026/123456',
    process: WC_PROCESS, generalDocuments: WC_GENERAL_DOCUMENTS, categories: WC_CATEGORIES, insurers: WC_INSURERS,
  },
  pa: {
    id: 'pa', label: 'Personal Accidental', short: 'personal accident', icon: 'fa-user-injured', ticketPrefix: 'SME-PA-',
    policyPlaceholder: 'e.g. PA/2026/123456',
    process: PA_PROCESS, generalDocuments: PA_GENERAL_DOCUMENTS, categories: PA_CATEGORIES, claimTypes: PA_CLAIM_TYPES,
    insurers: PA_INSURERS,
  },
  // Same claim process and checklist as PA — the policy covers a group of
  // employees / members, so the claim is made for one insured member.
  gpa: {
    id: 'gpa', label: 'Group Personal Accidental', short: 'group personal accident', icon: 'fa-users', ticketPrefix: 'SME-GPA-',
    policyPlaceholder: 'e.g. GPA/2026/123456',
    process: PA_PROCESS, generalDocuments: PA_GENERAL_DOCUMENTS, categories: PA_CATEGORIES, claimTypes: PA_CLAIM_TYPES,
    insurers: PA_INSURERS,
  },
  gmc: {
    id: 'gmc', label: 'Group Mediclaim (GMC)', short: 'group mediclaim', icon: 'fa-hospital-user', ticketPrefix: 'SME-GMC-',
    policyPlaceholder: 'e.g. GMC/2026/123456',
    process: GMC_PROCESS, generalDocuments: GMC_GENERAL_DOCUMENTS, categories: GMC_CATEGORIES, insurers: GMC_INSURERS,
  },
  machinery: {
    id: 'machinery', label: 'Machinery Insurance', short: 'machinery', icon: 'fa-gears', ticketPrefix: 'SME-MCH-',
    policyPlaceholder: 'e.g. MB/2026/123456',
    intro: MACHINERY_INTRO,
    process: MACHINERY_PROCESS, generalDocuments: MACHINERY_GENERAL_DOCUMENTS, documentInfo: MACHINERY_DOCUMENT_INFO,
    extraDocuments: MACHINERY_EXTRA_DOCUMENTS, categories: [], insurers: WC_INSURERS,
  },
  cattle: {
    id: 'cattle', label: 'Cattle Insurance', short: 'cattle', icon: 'fa-cow', ticketPrefix: 'SME-CTL-',
    policyPlaceholder: 'e.g. CTL/2026/123456',
    intro: CATTLE_INTRO,
    process: CATTLE_PROCESS, exclusions: CATTLE_EXCLUSIONS, generalDocuments: CATTLE_GENERAL_DOCUMENTS,
    categories: [], insurers: WC_INSURERS,
  },
  marine: {
    id: 'marine', label: 'Marine Insurance', short: 'marine', icon: 'fa-ship', ticketPrefix: 'SME-MAR-',
    policyPlaceholder: 'e.g. MAR/2026/123456',
    intro: MARINE_INTRO,
    process: MARINE_PROCESS, checklistNote: MARINE_CHECKLIST_NOTE, generalDocuments: MARINE_GENERAL_DOCUMENTS,
    categories: [], insurers: WC_INSURERS,
  },
  // No guide: the insured / partner enters the insurance type, insurer and
  // documents themselves in the claim wizard.
  others: {
    id: 'others', label: 'Others', short: 'insurance', icon: 'fa-ellipsis', ticketPrefix: 'SME-OTH-',
    policyPlaceholder: 'e.g. POL/2026/123456',
    process: [], generalDocuments: [], categories: [], insurers: [],
  },
};

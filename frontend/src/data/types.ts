// Shared shapes used by every SME product's claim guide.

export interface ProcessStep {
  title: string;
  detail: string;
  points?: string[];
}

// A benefit the policy pays out, shown on the claim guide.
export interface ClaimType {
  title: string;
  detail: string;
  icon: string;
}

export interface DocumentInfo {
  purpose: string;
  source: string;
}

export interface ClaimCategory {
  id: string;
  label: string;
  icon: string;
  documents: string[];
  // shown alongside `documents` when the product has a separate cashless checklist
  cashlessDocuments?: string[];
}

export interface Insurer {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  tip?: string;
}

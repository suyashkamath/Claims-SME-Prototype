// Travel insurance claim process + document checklist.
// The checklist is common across all insurance companies (source: TATA AIG
// "documents required for travel insurance" guide).

import type { ClaimCategory, Insurer, ProcessStep } from './types';

export const TRAVEL_PROCESS: ProcessStep[] = [
  { title: 'Intimation', detail: 'Inform the insurer as soon as an incident occurs.' },
  { title: 'Claim Form', detail: 'Submit the claim form with required documents.' },
  { title: 'Supporting Documents', detail: 'Provide supporting documents — bills, receipts, medical reports, police report, travel tickets, etc.' },
  { title: 'Verification', detail: 'Insurer verifies the claim and checks policy coverage.' },
  { title: 'Decision', detail: 'Claim is approved/rejected based on the policy terms.' },
  { title: 'Settlement', detail: 'Settlement is paid to the insured after approval.' },
];

export const GENERAL_DOCUMENTS: string[] = [
  'Duly filled and signed travel claim form',
  'Copy of tickets or boarding passes',
  'Copy of passport',
  'Copy of itinerary details',
  'Copy of accommodation proof',
  'Travel insurance policy document',
];

export const CLAIM_CATEGORIES: ClaimCategory[] = [
  {
    id: 'medical', label: 'Medical Emergency', icon: 'fa-kit-medical',
    documents: [
      'Copy of medical records and discharge summary',
      'Copy of diagnostic reports',
      'Original bills and receipts of treatment',
      'Original transport expenses proof',
      'Bills of medical service availed during evacuation',
      'Physician recommendation for medical evacuation',
    ],
  },
  {
    id: 'death', label: 'Accidental Death, Disablement & Repatriation of Remains', icon: 'fa-user-injured',
    documents: [
      'Copy of medical records',
      'Original bills and receipts of treatment',
      'Copy of diagnostic report',
      'Copy of death certificate with cause of death',
      'Attested postmortem report or coroner’s report (if conducted)',
      'Attested copy of FIR (if filed)',
      'Funeral certificate along with original bills',
    ],
  },
  {
    id: 'baggage-delay', label: 'Delayed or Loss of Check-in Baggage', icon: 'fa-suitcase-rolling',
    documents: [
      'Property Irregularity Report (PIR) from the airline mentioning hours of delay',
      'Copies of correspondence with airline authorities confirming the loss',
    ],
  },
  {
    id: 'liability', label: 'Personal Liability', icon: 'fa-scale-balanced',
    documents: [
      'Full written statement of the facts, along with witnesses',
      'Any other documents relevant to the incident',
      'Any other relevant information the policyholder wants to share',
    ],
  },
  {
    id: 'flight-delay', label: 'Flight Delay and Cancellation', icon: 'fa-plane-circle-exclamation',
    documents: [
      'Correspondence with airline authority certifying the reason for delay',
      'Correspondence with airlines for flight cancellation',
      'Supporting documents for the amount refunded by Common Carrier',
    ],
  },
  {
    id: 'trip-cancel', label: 'Trip Curtailment and Trip Cancellation', icon: 'fa-calendar-xmark',
    documents: [
      'Death certificate of companion / immediate family member / policyholder (curtailment reason)',
      'Airline correspondence with details of hijack incident (curtailment reason)',
      'Other evidence related to trip curtailment, e.g. newspaper cutting',
      'Medical records or death certificate related to trip cancellation reason',
      'Copy of tickets and correspondence with airline related to trip cancellation',
      'Medical certificate from the physician related to trip cancellation',
    ],
  },
  {
    id: 'missed-connection', label: 'Missed Flight Connection', icon: 'fa-route',
    documents: [
      'Airline correspondence on the delay',
      'Copy of the new ticket and boarding pass',
      'Proof of accident of vehicle used for reaching airport (if applicable)',
      'Any other evidence related to the missed flight connection',
    ],
  },
  {
    id: 'bounced-booking', label: 'Bounced Hotel or Airline Booking', icon: 'fa-hotel',
    documents: [
      'Correspondence with hotel booking agency for confirmed booking and reason for bounce',
      'Supporting documents for the amount refunded by accommodation',
      'Correspondence with airline regarding confirmed booking and reason for bounce',
      'Copy of new tickets and boarding pass',
      'Supporting documents for the amount refunded by Common Carrier',
    ],
  },
  {
    id: 'hijack', label: 'Hijack or Kidnapping Allowance', icon: 'fa-user-shield',
    documents: [
      'Full written statement of the event',
      'Airline correspondence with details of the hijack incident',
      'Copy of FIR in case of kidnapping',
    ],
  },
  {
    id: 'accommodation-ext', label: 'Accommodation Extension', icon: 'fa-bed',
    documents: [
      'Medical records / discharge summary / treating doctor’s report and prescription (if applicable)',
      'Original bills or receipts',
      'Copy of diagnostic reports (if any)',
      'Supporting documents of accommodation charges',
      'Original and revised itinerary with travel tickets and accommodation booking',
      'Evidence of delays caused by natural disasters or terrorism',
      'Confirmation from Common Carrier of delays, with copy of claim for expenses',
    ],
  },
  {
    id: 'baggage-passport-loss', label: 'Loss of Personal Baggage or Passport', icon: 'fa-passport',
    documents: [
      'Copy of FIR and final police report (theft / burglary) stating the loss',
      'Itemised list of lost items with invoices and receipts',
      'Proof of ownership of the items',
      'Copy of duplicate or new passport',
      'Original bills / receipts for expenses incurred to obtain a new passport',
    ],
  },
  {
    id: 'compassionate', label: 'Compassionate Visit', icon: 'fa-people-group',
    documents: [
      'Copy of medical records or discharge summary',
      'Copy of diagnostic / pathological / radiological reports (if any)',
      'New ticket and boarding pass for the Immediate Family Member',
      'Original scheduled itinerary of the policyholder',
      'Bills and receipts for accommodation and meals of the family member',
    ],
  },
  {
    id: 'cash-loss', label: 'Loss of Cash', icon: 'fa-money-bill-wave',
    documents: [
      'FIR / police report stating loss of cash (within 12 hours of the incident)',
      'Proof of Forex purchase',
      'Written proof of loss from Common Carrier / airport / accommodation with compensation details (if applicable)',
    ],
  },
  {
    id: 'business-upgrade', label: 'Upgradation to Business Class', icon: 'fa-couch',
    documents: [
      'Cancellation and refund details of original return ticket, with copy of new ticket',
      'Airline confirmation of additional fare incurred towards the upgrade',
    ],
  },
  {
    id: 'rental-vehicle', label: 'Rental Vehicle Cover', icon: 'fa-car-side',
    documents: [
      'Copy of car rental agreement',
      'Police report or FIR confirming the incident',
      'Copy of internationally recognised licence',
      'Bills and payment receipts',
    ],
  },
  {
    id: 'alt-transport', label: 'Alternative Transport Expense', icon: 'fa-bus',
    documents: [
      'Correspondence certifying delay / cancellation / diversion and actual arrival date & time',
      'Purchase bills or receipts of alternate transport tickets',
    ],
  },
  {
    id: 'frequent-flyer', label: 'Frequent Flyer Cover', icon: 'fa-ticket',
    documents: ['Proof that tickets are booked under the frequent flyer program'],
  },
  {
    id: 'adventure', label: 'Adventure Sports', icon: 'fa-person-skiing',
    documents: [
      'Proof that the injury or illness is due to participation in adventure sports',
      'Medical records / discharge summary / doctor’s report and prescription (if applicable)',
      'Original bills or receipts',
      'Copy of diagnostic / pathological / radiological reports (if any)',
      'Proof of transport expenses (if applicable)',
      'Invoices of medical services availed during evacuation (if applicable)',
      'Physician recommendation for medical evacuation (if applicable)',
      'Death certificate with cause of death (if applicable)',
      'Attested postmortem / coroner’s report (if conducted)',
      'Attested FIR and police inquest report (if filed and available)',
    ],
  },
  {
    id: 'minor-child', label: 'Accompaniment of Minor Child', icon: 'fa-child',
    documents: [
      'New ticket and boarding pass for the minor child',
      'New ticket and boarding pass for the accompanying immediate family member',
      'Medical records / discharge summary / doctor’s report and prescription (if applicable)',
      'Copy of diagnostic / pathological / radiological reports (if any)',
    ],
  },
  {
    id: 'pandemic', label: 'Pandemic Cover', icon: 'fa-virus',
    documents: [
      'Proof that the illness is declared a pandemic at Phase 4 or higher by WHO',
      'Proof of required quarantine with doctor’s prescription',
      'Copy of diagnostic / pathological / radiological reports',
    ],
  },
  {
    id: 'electronics', label: 'Loss of Electronic Portable Item', icon: 'fa-laptop',
    documents: [
      'Copy of FIR or police report stating the loss of items',
      'Proof of loss in writing',
      'Proof of ownership incl. original bills, receipts and repair bills',
    ],
  },
  {
    id: 'fraud-charges', label: 'Fraudulent Charges', icon: 'fa-credit-card',
    documents: [
      'Documentation from card issuer verifying the unauthorised charges',
      'Official police report regarding the loss',
      'Written intimation within 24 hours of discovering the unauthorised charge',
      'FIR filed within 24 hours of discovering the loss',
      'Any other documents the insurer may ask for',
    ],
  },
  {
    id: 'visa-rejection', label: 'Visa Rejection', icon: 'fa-stamp',
    documents: [
      'Proof of visa appointment and visa rejection from the embassy',
      'Proof of visa reapplication',
    ],
  },
  {
    id: 'coma', label: 'Coma Cover', icon: 'fa-bed-pulse',
    documents: [
      'Medical records / discharge summary / doctor’s report and prescription (if applicable)',
      'Original bills or receipts',
      'Copy of diagnostic / pathological / radiological reports (if any)',
      'Attested FIR and police inquest report (if filed and available)',
    ],
  },
  {
    id: 'home-burglary', label: 'Home Content Burglary', icon: 'fa-house-lock',
    documents: [
      'Copy of FIR',
      'Copy of the estimate of loss acknowledged by the police',
      'Details of items lost / damaged with purchase invoices (or alternative proofs)',
      'Bills and payment proof for repairs (if any)',
      'Other evidence such as newspaper cuttings (if available)',
    ],
  },
];

export const TRAVEL_INSURERS: Insurer[] = [
  { id: 'tata-aig', name: 'TATA AIG General Insurance', phone: '1800-266-7780', email: 'travelclaims@tataaig.com', website: 'www.tataaig.com' },
  { id: 'icici-lombard', name: 'ICICI Lombard General Insurance', phone: '1800-2666', email: 'customersupport@icicilombard.com', website: 'www.icicilombard.com' },
  { id: 'bajaj-allianz', name: 'Bajaj Allianz General Insurance', phone: '1800-209-5858', email: 'travel@bajajallianz.co.in', website: 'www.bajajallianz.com' },
  { id: 'hdfc-ergo', name: 'HDFC ERGO General Insurance', phone: '022-6234-6234', email: 'care@hdfcergo.com', website: 'www.hdfcergo.com' },
  { id: 'reliance', name: 'Reliance General Insurance', phone: '1800-3009', email: 'services.rgicl@relianceada.com', website: 'www.reliancegeneral.co.in' },
  { id: 'care', name: 'Care Health Insurance', phone: '1800-102-4488', email: 'customerfirst@careinsurance.com', website: 'www.careinsurance.com' },
  { id: 'new-india', name: 'The New India Assurance', phone: '1800-209-1415', email: 'tech.support@newindia.co.in', website: 'www.newindia.co.in' },
  { id: 'sbi-general', name: 'SBI General Insurance', phone: '1800-22-1111', email: 'customer.care@sbigeneral.in', website: 'www.sbigeneral.in' },
  { id: 'future-generali', name: 'Future Generali India Insurance', phone: '1800-220-233', email: 'fgcare@futuregenerali.in', website: 'www.futuregenerali.in' },
  { id: 'digit', name: 'Go Digit General Insurance', phone: '1800-258-4242', email: 'hello@godigit.com', website: 'www.godigit.com' },
];

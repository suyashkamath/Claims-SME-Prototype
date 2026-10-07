// Workmen Compensation claim process, document checklist and compensation
// formulas. Compensation is statutory (Employee's Compensation Act, 1923), so
// the process, checklist and calculation are the same across all insurance
// companies (source: TATA AIG "workmen compensation claim settlement process").
import type { ClaimCategory, Insurer, ProcessStep } from './types';

export const WC_PROCESS: ProcessStep[] = [
  { title: 'Report the Incident', detail: 'The employee informs the employer of the accident within the specified timeframe. Make sure everything is properly documented.' },
  { title: 'Get Medical Attention', detail: 'Seek treatment at an authorised hospital. The doctor’s assessment of the nature and extent of the injury is key to the settlement.' },
  { title: 'Provide Documents to Employer', detail: 'Gather the claim form, medical reports, incident report and other documents, check the details are correct, and submit them to the employer.' },
  { title: 'Employer Files Claim', detail: 'The employer reviews the documents and files the workmen compensation claim with the insurance company.' },
  { title: 'Claim Investigation', detail: 'The insurer reviews the claim and may investigate the incident, medical reports and policy coverage to confirm authenticity.' },
  { title: 'Claim Decision', detail: 'The insurer approves (with the compensation amount) or rejects (with reasons) the claim and informs the employer and employee.' },
  { title: 'Negotiating Settlement', detail: 'If the amount seems unfair or doesn’t cover medical expenses and wage loss, request a review with additional documents or medical opinions.' },
  { title: 'Finalising Settlement', detail: 'Once both parties agree, the insurer disburses the approved amount as per the policy terms and the claim is closed.' },
];

export const WC_GENERAL_DOCUMENTS: string[] = [
  'Duly filled and signed claim form',
  'Employer incident report',
  'Identity proof',
  'Address proof',
  'Salary slip',
];

export type WcCalcKind = 'death' | 'permanent' | 'temporary' | 'injury';

export const WC_CATEGORIES: (ClaimCategory & { id: WcCalcKind })[] = [
  {
    id: 'death', label: 'Death', icon: 'fa-ribbon',
    documents: [
      'Workmen Compensation Act Form A',
      'Post mortem report',
      'Death certificate',
      'Copy of FIR',
    ],
  },
  {
    id: 'permanent', label: 'Permanent Disability', icon: 'fa-wheelchair',
    documents: [
      'Doctor’s report stating the percentage of permanent disability',
      'Photographs and evidence supporting the disability',
    ],
  },
  {
    id: 'temporary', label: 'Temporary Disability', icon: 'fa-crutch',
    documents: ['Certificate from the doctor stating the temporary disability'],
  },
  {
    id: 'injury', label: 'Accidental Injury', icon: 'fa-user-injured',
    documents: [
      'Detailed report of the accident',
      'Medical diagnosis report',
      'Medical bills and invoices',
    ],
  },
];

// Workmen compensation is sold by general insurers, so this list is the
// general (non-health) insurers.
export const WC_INSURERS: Insurer[] = [
  { id: 'tata-aig', name: 'TATA AIG General Insurance', phone: '1800-266-7780', email: 'customersupport@tataaig.com', website: 'www.tataaig.com' },
  { id: 'icici-lombard', name: 'ICICI Lombard General Insurance', phone: '1800-2666', email: 'customersupport@icicilombard.com', website: 'www.icicilombard.com' },
  { id: 'bajaj-allianz', name: 'Bajaj Allianz General Insurance', phone: '1800-209-5858', email: 'customercare@bajajallianz.co.in', website: 'www.bajajallianz.com' },
  { id: 'hdfc-ergo', name: 'HDFC ERGO General Insurance', phone: '022-6234-6234', email: 'care@hdfcergo.com', website: 'www.hdfcergo.com' },
  { id: 'reliance', name: 'Reliance General Insurance', phone: '1800-3009', email: 'services.rgicl@relianceada.com', website: 'www.reliancegeneral.co.in' },
  { id: 'new-india', name: 'The New India Assurance', phone: '1800-209-1415', email: 'tech.support@newindia.co.in', website: 'www.newindia.co.in' },
  { id: 'united-india', name: 'United India Insurance', phone: '1800-425-33333', email: 'customercare@uiic.co.in', website: 'www.uiic.co.in' },
  { id: 'national', name: 'National Insurance Company', phone: '1800-345-0330', email: 'customer.relations@nic.co.in', website: 'www.nationalinsurance.nic.co.in' },
  { id: 'oriental', name: 'The Oriental Insurance Company', phone: '1800-118-485', email: 'csd@orientalinsurance.co.in', website: 'www.orientalinsurance.org.in' },
  { id: 'sbi-general', name: 'SBI General Insurance', phone: '1800-22-1111', email: 'customer.care@sbigeneral.in', website: 'www.sbigeneral.in' },
  { id: 'future-generali', name: 'Future Generali India Insurance', phone: '1800-220-233', email: 'fgcare@futuregenerali.in', website: 'www.futuregenerali.in' },
  { id: 'digit', name: 'Go Digit General Insurance', phone: '1800-258-4242', email: 'hello@godigit.com', website: 'www.godigit.com' },
];

// ── Compensation calculation (Employee's Compensation Act, 1923, Sec. 4) ──

// Schedule IV "relevant factor", indexed by the employee's completed age on
// their last birthday. Ages below 16 use the 16 factor; 65 and above use 99.37.
const RELEVANT_FACTORS: Record<number, number> = {
  16: 228.54, 17: 227.49, 18: 226.38, 19: 225.22, 20: 224.00, 21: 222.71, 22: 221.37, 23: 219.95, 24: 218.47,
  25: 216.91, 26: 215.28, 27: 213.57, 28: 211.79, 29: 209.92, 30: 207.98, 31: 205.95, 32: 203.85, 33: 201.66,
  34: 199.40, 35: 197.06, 36: 194.64, 37: 192.14, 38: 189.56, 39: 186.90, 40: 184.17, 41: 181.37, 42: 178.49,
  43: 175.54, 44: 172.52, 45: 169.44, 46: 166.29, 47: 163.07, 48: 159.80, 49: 156.47, 50: 153.09, 51: 149.67,
  52: 146.20, 53: 142.68, 54: 139.13, 55: 135.56, 56: 131.95, 57: 128.33, 58: 124.70, 59: 121.05, 60: 117.41,
  61: 113.77, 62: 110.14, 63: 106.52, 64: 102.93, 65: 99.37,
};

export function relevantFactor(age: number): number {
  return RELEVANT_FACTORS[Math.min(65, Math.max(16, Math.floor(age)))];
}

export const MIN_DEATH_COMPENSATION = 120000;
export const MIN_PERMANENT_TOTAL_COMPENSATION = 140000;
// Monthly wage ceiling notified under Sec. 4(1B) (S.O. 71(E), 3 Jan 2020).
// Policies differ on whether it is applied, so the calculator makes it optional.
export const WAGE_CEILING = 15000;

export interface WcCalcInput {
  kind: WcCalcKind;
  monthlyWage: number;
  age: number;
  applyWageCeiling: boolean;
  disabilityPercent: number; // permanent: % loss of earning capacity (100 = total)
  disabilityDays: number; // temporary: days off work as certified by the doctor
  medicalBills: number; // injury: medical expenses incurred
}

export interface WcCalcResult {
  amount: number;
  wage: number; // wage actually used, after the optional ceiling
  factor?: number;
  lines: { label: string; value: string }[];
  note?: string;
}

export const inr = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

export function calculateCompensation(i: WcCalcInput): WcCalcResult {
  const wage = i.applyWageCeiling ? Math.min(i.monthlyWage, WAGE_CEILING) : i.monthlyWage;
  const wageLine = { label: 'Monthly wage used', value: inr(wage) + (wage < i.monthlyWage ? ` (capped from ${inr(i.monthlyWage)})` : '') };

  if (i.kind === 'death') {
    const factor = relevantFactor(i.age);
    const formula = 0.5 * wage * factor;
    const amount = Math.max(formula, MIN_DEATH_COMPENSATION);
    return {
      amount, wage, factor,
      lines: [
        wageLine,
        { label: `Relevant factor (age ${Math.floor(i.age)})`, value: factor.toFixed(2) },
        { label: `50% × ${inr(wage)} × ${factor.toFixed(2)}`, value: inr(formula) },
        { label: 'Minimum compensation', value: inr(MIN_DEATH_COMPENSATION) },
      ],
      note: 'Whichever is higher is payable to the dependants.',
    };
  }

  if (i.kind === 'permanent') {
    const factor = relevantFactor(i.age);
    const total = Math.max(0.6 * wage * factor, MIN_PERMANENT_TOTAL_COMPENSATION);
    const pct = Math.min(100, Math.max(0, i.disabilityPercent));
    const amount = (total * pct) / 100;
    return {
      amount, wage, factor,
      lines: [
        wageLine,
        { label: `Relevant factor (age ${Math.floor(i.age)})`, value: factor.toFixed(2) },
        { label: `60% × ${inr(wage)} × ${factor.toFixed(2)}`, value: inr(0.6 * wage * factor) },
        { label: 'Total disablement (min. ₹1,40,000)', value: inr(total) },
        { label: 'Loss of earning capacity', value: `${pct}%` },
      ],
      note: pct < 100 ? 'Partial permanent disability is paid as this % of the total disablement amount.' : undefined,
    };
  }

  if (i.kind === 'temporary') {
    const days = Math.max(0, Math.floor(i.disabilityDays));
    // 3-day waiting period, waived when the disability lasts 28 days or more.
    const payableDays = days >= 28 ? days : Math.max(0, days - 3);
    const fortnights = payableDays / 15;
    const perFortnight = 0.25 * wage;
    const amount = perFortnight * fortnights;
    return {
      amount, wage,
      lines: [
        wageLine,
        { label: 'Half-monthly payment (25% of wage)', value: inr(perFortnight) },
        { label: 'Disability period', value: `${days} days` },
        { label: 'Payable fortnights', value: (Math.round(fortnights * 100) / 100).toString() },
      ],
      note: days < 28 ? 'The first 3 days are not payable when disability lasts less than 28 days.' : undefined,
    };
  }

  return {
    amount: i.medicalBills, wage,
    lines: [{ label: 'Medical bills and invoices', value: inr(i.medicalBills) }],
    note: 'Medical expenses are reimbursed against the bills, as per the policy limits.',
  };
}

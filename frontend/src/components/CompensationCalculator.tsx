import { useState } from 'react';
import {
  WAGE_CEILING, WC_CATEGORIES, calculateCompensation, inr, type WcCalcKind, type WcCalcResult,
} from '../data/workmen';

const FORMULAS: Record<WcCalcKind, { formula: string; example: string }> = {
  death: {
    formula: '50% of monthly wage × relevant factor, or ₹1,20,000 — whichever is higher',
    example: 'Madhav, 35 yrs, ₹12,000/month → 50% × 12,000 × 197.06 = ₹11,82,360',
  },
  permanent: {
    formula: '60% of monthly wage × relevant factor, or ₹1,40,000 — whichever is higher. For partial disability, multiply by the % loss of earning capacity.',
    example: 'Suresh, 40 yrs, ₹20,000/month, 100% → 60% × 20,000 × 184.17 = ₹22,10,040',
  },
  temporary: {
    formula: '25% of monthly wage, paid every 15 days for the period of disability',
    example: 'Heena, ₹16,000/month, 3 months rest → ₹4,000 × 6 fortnights = ₹24,000',
  },
  injury: {
    formula: 'Medical expenses reimbursed against bills and invoices, as per policy limits',
    example: 'Hospital + medicine bills of ₹38,500 → ₹38,500 (subject to policy limits)',
  },
};

export function CalcBreakdown({ result }: { result: Pick<WcCalcResult, 'amount' | 'lines' | 'note'> }) {
  return (
    <div className="calc-result">
      <dl className="calc-lines">
        {result.lines.map((l) => (
          <div key={l.label}><dt>{l.label}</dt><dd>{l.value}</dd></div>
        ))}
      </dl>
      <div className="calc-total">
        <small>Estimated compensation</small>
        <span>{inr(Math.round(result.amount))}</span>
      </div>
      {result.note && <p className="calc-note"><i className="fas fa-circle-info" /> {result.note}</p>}
    </div>
  );
}

// Standalone calculator shown on the Workmen Compensation claim guide.
export default function CompensationCalculator() {
  const [kind, setKind] = useState<WcCalcKind>('death');
  const [wage, setWage] = useState('12000');
  const [age, setAge] = useState('35');
  const [percent, setPercent] = useState('100');
  const [days, setDays] = useState('90');
  const [bills, setBills] = useState('');
  const [ceiling, setCeiling] = useState(false);

  const result = calculateCompensation({
    kind,
    monthlyWage: Number(wage) || 0,
    age: Number(age) || 16,
    applyWageCeiling: ceiling,
    disabilityPercent: Number(percent) || 0,
    disabilityDays: Number(days) || 0,
    medicalBills: Number(bills) || 0,
  });

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-head-icon"><i className="fas fa-calculator" /></div>
        <h3 className="card-title">How the compensation is calculated</h3>
      </div>
      <p className="muted mb">
        Compensation is fixed by the Employee's Compensation Act, 1923, so these formulas are the same for every insurance company.
      </p>

      <div className="calc-tabs">
        {WC_CATEGORIES.map((c) => (
          <button key={c.id} className={'calc-tab' + (kind === c.id ? ' selected' : '')} onClick={() => setKind(c.id)}>
            <i className={'fas ' + c.icon} /> {c.label}
          </button>
        ))}
      </div>

      <div className="formula-box">
        <p className="section-label">Formula</p>
        <p className="formula">{FORMULAS[kind].formula}</p>
        <p className="formula-example"><b>Example:</b> {FORMULAS[kind].example}</p>
      </div>

      <div className="calc-layout no-print">
        <div>
          {kind !== 'injury' && (
            <label className="field">
              <span className="field-label">Monthly Wage (₹)</span>
              <input type="number" min="0" className="input" value={wage} onChange={(e) => setWage(e.target.value)} />
            </label>
          )}
          {(kind === 'death' || kind === 'permanent') && (
            <label className="field">
              <span className="field-label">Age of employee (last birthday)</span>
              <input type="number" min="14" max="80" className="input" value={age} onChange={(e) => setAge(e.target.value)} />
            </label>
          )}
          {kind === 'permanent' && (
            <label className="field">
              <span className="field-label">Disability % <em>(as per doctor's report; 100 = total)</em></span>
              <input type="number" min="1" max="100" className="input" value={percent} onChange={(e) => setPercent(e.target.value)} />
            </label>
          )}
          {kind === 'temporary' && (
            <label className="field">
              <span className="field-label">Disability period (days)</span>
              <input type="number" min="0" className="input" value={days} onChange={(e) => setDays(e.target.value)} />
            </label>
          )}
          {kind === 'injury' && (
            <label className="field">
              <span className="field-label">Medical bills total (₹)</span>
              <input type="number" min="0" className="input" value={bills} onChange={(e) => setBills(e.target.value)} placeholder="0" />
            </label>
          )}
          {kind !== 'injury' && (
            <label className="check">
              <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} />
              <span>Apply statutory wage ceiling of {inr(WAGE_CEILING)}/month <em>(if the policy follows it)</em></span>
            </label>
          )}
        </div>
        <CalcBreakdown result={result} />
      </div>
    </div>
  );
}

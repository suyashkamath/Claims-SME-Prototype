import { useMemo, useState } from 'react';
import type { ProductConfig } from '../data/products';
import { loadClaims, type ClaimStatus } from '../store';

const STATUS_LABEL: Record<ClaimStatus, string> = {
  REGISTERED: 'Registered',
  DOCS_PENDING: 'Docs Pending',
  UNDER_VERIFICATION: 'Under Verification',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SETTLED: 'Settled',
};

interface Props {
  product: ProductConfig;
  initialTicket: string | null;
  onBack: () => void;
}

export default function TrackClaim({ product, initialTicket, onBack }: Props) {
  const claims = useMemo(() => loadClaims().filter((c) => (c.productId ?? 'travel') === product.id), [product.id]);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(initialTicket);

  const filtered = claims.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || [c.ticket, c.clientName, c.policyNumber, c.insurerName, c.employeeName ?? '', c.machineName ?? '', c.animal ?? '', c.shipment ?? ''].some((v) => v.toLowerCase().includes(q));
  });

  return (
    <section className="fade-up">
      <button className="link-back" onClick={onBack}>
        <i className="fas fa-arrow-left" /> {product.id === 'others' ? 'Back to Products' : 'Back to Claim Guide'}
      </button>
      <div className="page-head">
        <p className="eyebrow">SME · {product.label}</p>
        <h2 className="page-title sm">Track a Claim</h2>
      </div>

      <div className="card search-card">
        <i className="fas fa-magnifying-glass combo-icon" />
        <input className="input combo-input" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ticket number, client name, policy number or insurer…" />
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-folder-open" />
          <p>No claims found.</p>
        </div>
      )}

      <div className="stack">
        {filtered.map((c) => {
          const open = expanded === c.ticket;
          return (
            <div key={c.ticket} className={'card claim-card' + (open ? ' open' : '')}>
              <button className="claim-head" onClick={() => setExpanded(open ? null : c.ticket)}>
                <div className="guide-icon sm"><i className={'fas ' + product.icon} /></div>
                <div className="claim-meta">
                  <p className="eyebrow">{c.insurerName} · {c.categoryLabel ?? product.label}</p>
                  <p className="claim-name">{c.clientName}</p>
                  <div className="claim-sub">
                    <span className="mono tag">{c.ticket}</span>
                    <span><i className="fas fa-shield-halved" /> {c.policyNumber}</span>
                    <span><i className="fas fa-calendar" /> {new Date(c.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
                <span className={'status status-' + c.status.toLowerCase()}>{STATUS_LABEL[c.status]}</span>
                <i className={'fas fa-chevron-down acc-chevron' + (open ? ' rot' : '')} />
              </button>

              {open && (
                <div className={'claim-body fade-up' + (product.process.length ? '' : ' single')}>
                  {product.process.length > 0 && <div className="timeline">
                    {product.process.map((s, i) => {
                      const state = i < c.stage ? 'done' : i === c.stage ? 'current' : 'todo';
                      return (
                        <div key={s.title} className={'tl-item ' + state}>
                          <span className="tl-dot">{state === 'done' ? <i className="fas fa-check" /> : i + 1}</span>
                          <div>
                            <p className="step-title">{s.title}</p>
                            <p className="step-detail">{s.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>}
                  <dl className="details">
                    <div><dt>Filed with insurer</dt><dd>{c.filedWithInsurer}{c.insurerClaimNumber ? ` · ${c.insurerClaimNumber}` : ''}</dd></div>
                    {c.filedBy && <div><dt>Filed by</dt><dd>{c.filedBy}</dd></div>}
                    {c.productId === 'others' && <div><dt>Insurance</dt><dd>{c.product}</dd></div>}
                    {c.shipment && <div><dt>Shipment</dt><dd>{c.shipment}</dd></div>}
                    {c.animal && <div><dt>Animal</dt><dd>{c.animal}</dd></div>}
                    {c.machineName && <div><dt>Machine</dt><dd>{c.machineName}</dd></div>}
                    {c.claimMode && <div><dt>Claim mode</dt><dd>{c.claimMode}</dd></div>}
                    {c.employeeName && <div><dt>{c.productId === 'gmc' ? 'Patient / Member' : 'Employee'}</dt><dd>{c.employeeName}{c.employeeAge ? `, ${c.employeeAge} yrs` : ''}</dd></div>}
                    {c.monthlyWage && <div><dt>Monthly wage</dt><dd>₹{Number(c.monthlyWage).toLocaleString('en-IN')}</dd></div>}
                    {c.incidentDate && <div><dt>{c.productId === 'gmc' ? 'Date of admission' : c.productId === 'machinery' ? 'Date of breakdown' : 'Date of incident'}</dt><dd>{c.incidentDate}</dd></div>}
                    {c.incidentPlace && <div><dt>{c.productId === 'gmc' ? 'Hospital' : 'Place of incident'}</dt><dd>{c.incidentPlace}</dd></div>}
                    {c.claimAmount && <div><dt>Claim amount</dt><dd>{c.claimAmount}</dd></div>}
                    <div><dt>Documents uploaded</dt><dd>{c.documents.length}</dd></div>
                  </dl>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

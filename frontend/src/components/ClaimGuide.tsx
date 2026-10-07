import { useMemo, useState } from 'react';
import type { ProductConfig } from '../data/products';
import type { Insurer } from '../data/types';
import CompensationCalculator from './CompensationCalculator';

interface Props {
  product: ProductConfig;
  insurer: Insurer | null;
  onInsurerChange: (i: Insurer | null) => void;
  onBack: () => void;
  onStart: () => void;
  onTrack: () => void;
}

export default function ClaimGuide({ product, insurer, onInsurerChange, onBack, onStart, onTrack }: Props) {
  const [search, setSearch] = useState(insurer?.name ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || q === insurer?.name.toLowerCase()) return product.insurers;
    return product.insurers.filter((i) => i.name.toLowerCase().includes(q));
  }, [search, insurer, product]);

  const pick = (i: Insurer) => {
    onInsurerChange(i);
    setSearch(i.name);
    setDropdownOpen(false);
  };

  const downloadChecklist = () => {
    const lines = [
      `${product.label.toUpperCase()} – DOCUMENT CHECKLIST`,
      `Insurer: ${insurer?.name ?? ''}`,
      '',
      'GENERAL DOCUMENTS',
      ...product.generalDocuments.map((d) => {
        const info = product.documentInfo?.[d];
        return info ? `[ ] ${d} – ${info.purpose} (source: ${info.source})` : `[ ] ${d}`;
      }),
      '',
      ...(product.extraDocuments
        ? [product.extraDocuments.title.toUpperCase(), ...product.extraDocuments.documents.map((d) => `[ ] ${d}`), '']
        : []),
      ...product.categories.flatMap((c) => c.cashlessDocuments
        ? [
          `${c.label.toUpperCase()} – REIMBURSEMENT`, ...c.documents.map((d) => `[ ] ${d}`), '',
          `${c.label.toUpperCase()} – CASHLESS`, ...c.cashlessDocuments.map((d) => `[ ] ${d}`), '',
        ]
        : [c.label.toUpperCase(), ...c.documents.map((d) => `[ ] ${d}`), '']),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.label.toLowerCase().replace(/\s+/g, '-')}-document-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="fade-up">
      <button className="link-back no-print" onClick={onBack}>
        <i className="fas fa-arrow-left" /> Change Insurance Type
      </button>

      {/* Provider selection */}
      <div className="card provider-card no-print">
        <div>
          <p className="eyebrow">Provider Selection</p>
          <h2 className="card-title-lg">Choose Your Provider</h2>
        </div>
        <div className="combo">
          <i className="fas fa-magnifying-glass combo-icon" />
          <input
            className="input combo-input"
            value={search}
            placeholder="Search or select insurance company…"
            onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
          />
          {dropdownOpen && (
            <div className="combo-menu">
              {filtered.length === 0 && <p className="combo-empty">No matching insurance company found.</p>}
              {filtered.map((i) => (
                <button
                  key={i.id}
                  className={'combo-option' + (i.id === insurer?.id ? ' selected' : '')}
                  onMouseDown={() => pick(i)}
                >
                  {i.name}
                  {i.id === insurer?.id && <i className="fas fa-check" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!insurer && (
        <div className="empty-state">
          <i className="fas fa-building-shield" />
          <p>Please select an insurance company above to view the claim guide.</p>
        </div>
      )}

      {insurer && (
        <div className="guide-layout">
          {/* Left: guide */}
          <div className="guide-main">
            <div className="guide-head">
              <div className="guide-icon"><i className={'fas ' + product.icon} /></div>
              <div>
                <h1 className="page-title sm">Claim Guide: <span className="brand-text">{insurer.name}</span></h1>
                <p className="muted">Follow these instructions to file your {product.short} claim independently.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div className="card-head-icon"><i className="fas fa-list-ol" /></div>
                <h3 className="card-title">Step-by-Step Process</h3>
              </div>
              {product.intro && (
                <div className="info-box mb">
                  <i className="fas fa-bolt" />
                  <span>{product.intro}</span>
                </div>
              )}
              <ol className="steps">
                {product.process.map((s, i) => (
                  <li key={s.title} className="step">
                    <span className="step-num">{i + 1}</span>
                    <div>
                      <p className="step-title">{s.title}</p>
                      <p className="step-detail">{s.detail}</p>
                      {s.points && (
                        <ul className="step-points">
                          {s.points.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              {product.exclusions && (
                <div className="exclusions">
                  <p className="section-label"><i className="fas fa-ban" /> Exclusions — not covered</p>
                  <ul className="doc-list">
                    {product.exclusions.items.map((x) => (
                      <li key={x}><i className="fas fa-xmark" />{x}</li>
                    ))}
                  </ul>
                  {product.exclusions.note && (
                    <div className="info-box warn">
                      <i className="fas fa-triangle-exclamation" />
                      <span>{product.exclusions.note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {product.claimTypes && (
              <div className="card">
                <div className="card-head">
                  <div className="card-head-icon"><i className="fas fa-layer-group" /></div>
                  <h3 className="card-title">Types of Claims</h3>
                </div>
                <p className="muted mb">The claim you can make depends on the nature of the incident.</p>
                <div className="claim-types">
                  {product.claimTypes.map((t) => (
                    <div key={t.title} className="claim-type">
                      <i className={'fas ' + t.icon} />
                      <div>
                        <p className="step-title">{t.title}</p>
                        <p className="step-detail">{t.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-head">
                <div className="card-head-icon teal"><i className="fas fa-clipboard-check" /></div>
                <h3 className="card-title">Checklist for the document</h3>
              </div>

              {product.checklistNote && (
                <div className="info-box mb">
                  <i className="fas fa-circle-info" />
                  <span>{product.checklistNote}</span>
                </div>
              )}
              <p className="section-label">
                {product.categories.length > 0
                  ? `General documents (required for every ${product.short} claim)`
                  : `Documents required for a ${product.short} claim`}
              </p>
              {product.documentInfo ? (
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr><th>Document</th><th>Purpose</th><th>Typical Source</th></tr>
                    </thead>
                    <tbody>
                      {product.generalDocuments.map((d) => (
                        <tr key={d}>
                          <td><i className="fas fa-circle-check" />{d}</td>
                          <td>{product.documentInfo?.[d]?.purpose}</td>
                          <td>{product.documentInfo?.[d]?.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="doc-list">
                  {product.generalDocuments.map((d) => (
                    <li key={d}><i className="fas fa-circle-check" />{d}</li>
                  ))}
                </ul>
              )}

              {product.extraDocuments && (
                <>
                  <p className="section-label">{product.extraDocuments.title}</p>
                  <ul className="doc-list">
                    {product.extraDocuments.documents.map((d) => (
                      <li key={d}><i className="fas fa-file-lines" />{d}</li>
                    ))}
                  </ul>
                </>
              )}

              {product.categories.length > 0 && <p className="section-label">Additional documents by claim type</p>}
              {product.categories.length > 0 && <div className="accordion">
                {product.categories.map((c) => {
                  const open = openCategory === c.id;
                  return (
                    <div key={c.id} className={'acc-item' + (open ? ' open' : '')}>
                      <button className="acc-head" onClick={() => setOpenCategory(open ? null : c.id)}>
                        <i className={'fas ' + c.icon + ' acc-icon'} />
                        <span>{c.label}</span>
                        <span className="acc-count">{c.documents.length}</span>
                        <i className="fas fa-chevron-down acc-chevron" />
                      </button>
                      {open && !c.cashlessDocuments && (
                        <ul className="doc-list acc-body">
                          {c.documents.map((d) => (
                            <li key={d}><i className="fas fa-file-lines" />{d}</li>
                          ))}
                        </ul>
                      )}
                      {open && c.cashlessDocuments && (
                        <div className="acc-body">
                          <p className="section-label">Reimbursement</p>
                          <ul className="doc-list">
                            {c.documents.map((d) => (
                              <li key={d}><i className="fas fa-file-lines" />{d}</li>
                            ))}
                          </ul>
                          <p className="section-label">Cashless</p>
                          <ul className="doc-list">
                            {c.cashlessDocuments.map((d) => (
                              <li key={d}><i className="fas fa-file-lines" />{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>}

              <div className="btn-row no-print">
                <button className="btn btn-outline" onClick={() => window.print()}>
                  <i className="fas fa-print" /> Print
                </button>
                <button className="btn btn-outline" onClick={downloadChecklist}>
                  <i className="fas fa-download" /> Download
                </button>
              </div>
            </div>

            {product.id === 'workmen' && <CompensationCalculator />}
          </div>

          {/* Right: CTA + contact */}
          <aside className="guide-side no-print">
            <div className="cta-card">
              <h2>Couldn't file it yourself?</h2>
              <p>Don't worry! Our digital assistant will guide you through the process.</p>
              <button className="btn btn-white" onClick={onStart}>
                <i className="fas fa-file-circle-plus" /> Start Claim Process
              </button>
              <button className="btn btn-ghost-white" onClick={onTrack}>
                <i className="fas fa-magnifying-glass" /> Track Status
              </button>
            </div>

            <div className="card contact-card">
              <p className="eyebrow">{product.label}</p>
              <h3 className="card-title">{insurer.name}</h3>
              <a className="contact-row" href={'tel:' + insurer.phone}>
                <i className="fas fa-phone" /><div><small>Call at</small><span>{insurer.phone}</span></div>
              </a>
              <a className="contact-row" href={'mailto:' + insurer.email}>
                <i className="fas fa-envelope" /><div><small>Email at</small><span>{insurer.email}</span></div>
              </a>
              <a className="contact-row" href={'https://' + insurer.website} target="_blank" rel="noopener">
                <i className="fas fa-globe" /><div><small>URL</small><span>{insurer.website}</span></div>
              </a>
              {insurer.tip && (
                <div className="info-box mt">
                  <i className="fas fa-lightbulb" />
                  <span>{insurer.tip}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

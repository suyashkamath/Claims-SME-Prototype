import { useState } from 'react';
import { SME_PRODUCTS } from '../data/products';

export default function ProductSelect({ onSelect }: { onSelect: (id: string) => void }) {
  const [notice, setNotice] = useState('');

  return (
    <section className="fade-up">
      <div className="page-head center">
        <p className="eyebrow">SME Claims</p>
        <h2 className="page-title">Which SME insurance are you claiming for?</h2>
        <p className="muted">Select a product to view the claim guide and document checklist.</p>
      </div>

      <div className="product-grid">
        {SME_PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            className={'product-card' + (p.enabled ? '' : ' disabled')}
            onClick={() => (p.enabled ? onSelect(p.id) : setNotice(`${p.label} will be available soon.`))}
          >
            <span className="product-index">{i + 1}</span>
            {!p.enabled && <span className="soon-badge">Coming soon</span>}
            <div className="product-icon"><i className={'fas ' + p.icon} /></div>
            <span className="product-label">{p.label}</span>
            <i className="fas fa-chevron-right product-arrow" />
          </button>
        ))}
      </div>

      {notice && (
        <div className="toast" onAnimationEnd={() => setNotice('')} key={notice}>
          <i className="fas fa-circle-info" /> {notice}
        </div>
      )}
    </section>
  );
}

interface Crumb { label: string; onClick?: () => void }

export default function Header({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <header className="topbar no-print">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-logo"><i className="fas fa-shield-halved" /></div>
          <div>
            <p className="eyebrow">Probus Insurance</p>
            <h1 className="brand-title">POSP Portal</h1>
          </div>
        </div>
        <nav className="crumbs">
          {crumbs.map((c, i) => (
            <span key={i} className="crumb">
              {i > 0 && <i className="fas fa-chevron-right crumb-sep" />}
              {c.onClick && i < crumbs.length - 1
                ? <button className="crumb-link" onClick={c.onClick}>{c.label}</button>
                : <span className="crumb-current">{c.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { useState } from 'react';
import Header from './components/Header';
import ProductSelect from './components/ProductSelect';
import ClaimGuide from './components/ClaimGuide';
import ClaimWizard from './components/ClaimWizard';
import TrackClaim from './components/TrackClaim';
import { PRODUCT_CONFIGS, type ProductId } from './data/products';
import type { Insurer } from './data/types';

export type View = 'products' | 'guide' | 'wizard' | 'track';

// "Others" has no insurer list: the user types the insurer in the wizard.
const OTHER_INSURER: Insurer = { id: 'other', name: '', phone: '', email: '', website: '' };

export default function App() {
  const [view, setView] = useState<View>('products');
  const [productId, setProductId] = useState<ProductId>('travel');
  const [insurer, setInsurer] = useState<Insurer | null>(null);
  const [highlightTicket, setHighlightTicket] = useState<string | null>(null);

  const product = PRODUCT_CONFIGS[productId];
  const isOthers = productId === 'others';
  // "Others" has no claim guide, so its back links return to the product list
  const home: View = isOthers ? 'products' : 'guide';

  const go = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const selectProduct = (id: string) => {
    if (id !== productId) {
      // insurer lists differ per product
      setProductId(id as ProductId);
      setInsurer(null);
    }
    go(id === 'others' ? 'wizard' : 'guide');
  };

  return (
    <div className="app">
      <Header
        crumbs={[
          { label: 'SME', onClick: () => go('products') },
          ...(view !== 'products' ? [{ label: product.label, onClick: () => go(home) }] : []),
          ...(view === 'wizard' ? [{ label: 'Start a Claim' }] : []),
          ...(view === 'track' ? [{ label: 'Track a Claim' }] : []),
        ]}
      />
      <main className="container">
        {view === 'products' && <ProductSelect onSelect={selectProduct} />}
        {view === 'guide' && (
          <ClaimGuide
            key={productId}
            product={product}
            insurer={insurer}
            onInsurerChange={setInsurer}
            onBack={() => go('products')}
            onStart={() => go('wizard')}
            onTrack={() => { setHighlightTicket(null); go('track'); }}
          />
        )}
        {view === 'wizard' && (insurer || isOthers) && (
          <ClaimWizard
            key={productId}
            product={product}
            insurer={insurer ?? OTHER_INSURER}
            onExit={() => go(home)}
            onTrack={(ticket) => { setHighlightTicket(ticket); go('track'); }}
          />
        )}
        {view === 'track' && <TrackClaim product={product} initialTicket={highlightTicket} onBack={() => go(home)} />}
      </main>
    </div>
  );
}

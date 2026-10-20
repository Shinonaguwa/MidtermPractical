import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import DebugNotes from '../../components/DebugNotes.jsx';
import { CATEGORIES, PRODUCTS } from './products.js';

function trackFilterChange(details) {
  console.info('[analytics] explorer_filter_changed', details);
}

function getVisibleProducts(products, query, category, sortOrder) {
  const needle = query.trim().toLowerCase();

  const matches = products.filter((product) => {
    const matchesQuery = !needle || product.name.toLowerCase().includes(needle);
    const matchesCategory = category === 'All' || product.category === category;
    return matchesQuery && matchesCategory;
  });

  if (sortOrder === 'asc') {
    matches.sort((a, b) => a.price - b.price || a.id - b.id);
  } else if (sortOrder === 'desc') {
    matches.sort((a, b) => b.price - a.price || a.id - b.id);
  }

  return matches;
}

const ProductList = memo(function ProductList({ products, selectedId, onSelect }) {
  console.log(`[ProductList] render with ${products.length} products`);

  return (
    <ul className="product-list" aria-label="Products">
      {products.map((product) => (
        <li key={product.id} className={product.id === selectedId ? 'selected' : ''}>
          <button
            type="button"
            aria-pressed={product.id === selectedId}
            onClick={() => onSelect(product.id)}
          >
            <span>
              {product.name} <small>({product.category})</small>
            </span>
            <span>₱{product.price.toFixed(2)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
});

const DEBUG_CASES = [
  {
    title: 'useMemo is missing the query dependency (stale results)',
    broken: `const visibleProducts = useMemo(
  () => getVisibleProducts(PRODUCTS, query, category, sortOrder),
  [category, sortOrder]          // query is missing
);`,
    fixed: `const visibleProducts = useMemo(
  () => getVisibleProducts(PRODUCTS, query, category, sortOrder),
  [query, category, sortOrder]
);`,
    explanation:
      'useMemo only recalculates when a listed dependency changes. Without query in the array, typing in the search box never recomputes the list, so the old filtered results stay on screen. Every reactive value read by the calculation (query, category, sortOrder) must be listed. The unrelated counter is not read, so it is correctly left out.'
  },
  {
    title: 'useCallback is missing the selected value dependency',
    broken: `const handleSelect = useCallback((id) => {
  setSelectedId(selectedId === id ? null : id);
}, []);                         // selectedId is missing`,
    fixed: `const handleSelect = useCallback(
  (id) => {
    setSelectedId(selectedId === id ? null : id);
  },
  [selectedId]
);`,
    explanation:
      'With an empty array the callback is created once and keeps the selectedId from the first render (null). Clicking the selected product would never deselect it, because the comparison always uses the outdated value. Adding selectedId makes React create a new callback whenever the selection changes, so the handler stays current while remaining stable across unrelated renders such as the counter.'
  },
  {
    title: 'analytics call inside useMemo',
    broken: `const visibleProducts = useMemo(() => {
  trackFilterChange({ query, category, sortOrder });   // side effect
  return getVisibleProducts(PRODUCTS, query, category, sortOrder);
}, [query, category, sortOrder]);`,
    fixed: `const visibleProducts = useMemo(
  () => getVisibleProducts(PRODUCTS, query, category, sortOrder),
  [query, category, sortOrder]
);

useEffect(() => {
  trackFilterChange({ query, category, sortOrder });
}, [query, category, sortOrder]);`,
    explanation:
      'useMemo callbacks must be pure calculations. React may call them during rendering, more than once (Strict Mode) or discard the result, so a side effect there can run at the wrong time or be duplicated. Side effects that respond to a change belong in useEffect, which runs after the committed render.'
  }
];

export default function ProductExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');
  const [selectedId, setSelectedId] = useState(null);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  const visibleProducts = useMemo(
    () => getVisibleProducts(PRODUCTS, query, category, sortOrder),
    [query, category, sortOrder]
  );

  const handleSelect = useCallback(
    (id) => {
      setSelectedId(selectedId === id ? null : id);
    },
    [selectedId]
  );

  useEffect(() => {
    console.log(`[explorer] list recalculated: ${visibleProducts.length} matches`);
  }, [visibleProducts]);

  useEffect(() => {
    trackFilterChange({ query, category, sortOrder });
  }, [query, category, sortOrder]);

  const selectedProduct = PRODUCTS.find((product) => product.id === selectedId);

  return (
    <div>
      <h2>Exam 5: Product Explorer Performance Repair</h2>
      <p className="hint">
        Hook focus: useMemo and useCallback. Open the browser console: clicking the unrelated
        counter must not log a ProductList render or a list recalculation.
      </p>

      <div className="controls">
        <div className="field">
          <label htmlFor="product-search">Search products</label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="product-category">Category</label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="product-sort">Sort by price</label>
          <select
            id="product-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="none">Default order</option>
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="secondary" onClick={() => setUnrelatedCount((n) => n + 1)}>
          Unrelated counter: {unrelatedCount}
        </button>
      </div>

      <p role="status">
        Showing {visibleProducts.length} of {PRODUCTS.length} products
        {selectedProduct ? ` · Selected: ${selectedProduct.name}` : ''}
      </p>

      <ProductList
        products={visibleProducts}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <DebugNotes cases={DEBUG_CASES} />
    </div>
  );
}

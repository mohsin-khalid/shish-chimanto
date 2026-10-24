import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../common'
import { useProducts, ProductCard, State } from './shared'

export default function Products() {
  const { items, loading, error } = useProducts()
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''
  const cat = sp.get('cat') || ''
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }
  const list = items.filter(p => (!cat || p.category === cat) && (!q || (p.name || '').includes(q)))
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="گەڕان..." value={q} onChange={e => set('q', e.target.value)} />
        <select className="input sm:w-56" value={cat} onChange={e => set('cat', e.target.value)}>
          <option value="">هەموو جۆرەکان</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <State loading={loading} error={error} empty={!loading && !error && list.length === 0} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  )
}

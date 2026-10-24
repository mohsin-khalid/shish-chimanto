import { Link } from 'react-router-dom'
import { useSettings, CATEGORIES } from '../common'
import { useProducts, ProductCard, State } from './shared'

export default function Home() {
  const s = useSettings()
  const { items, loading, error } = useProducts()
  const featured = items.filter(p => p.featured).slice(0, 8)
  const list = featured.length ? featured : items.slice(0, 8)
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-dark p-8 text-center text-white sm:p-14">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">باشترین <span className="text-brand">شیش و چیمەنتۆ</span></h1>
        <p className="mb-6 text-gray-300">نرخی گونجاو، کوالیتی بەرز، گەیاندن بۆ شوێنی کارەکەت</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/products" className="btn">بینینی کاڵاکان</Link>
          {s.phone && <a href={`tel:${s.phone}`} className="btn-dark border border-white">پەیوەندی</a>}
          {s.whatsapp && <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} className="btn bg-green-600">WhatsApp</a>}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CATEGORIES.map(c => (
          <Link key={c} to={`/products?cat=${encodeURIComponent(c)}`} className="rounded-xl bg-white p-6 text-center text-lg font-bold shadow hover:text-brand">{c}</Link>
        ))}
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">کاڵا تایبەتەکان</h2>
        <State loading={loading} error={error} empty={!loading && !error && list.length === 0} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </div>
  )
}

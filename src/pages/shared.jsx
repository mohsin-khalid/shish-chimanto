import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../firebase'

export function useProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    getDocs(collection(db, 'products'))
      .then(s => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => setError('کێشەیەک ڕوویدا لە هێنانی کاڵاکان'))
      .finally(() => setLoading(false))
  }, [])
  return { items, loading, error }
}

export const fmtPrice = p => (p ? Number(p).toLocaleString('en-US') : '—')

export function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.id}`} className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
      <div className="aspect-[4/3] bg-gray-200">
        {p.image && <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="space-y-1 p-3">
        <h3 className="font-semibold">{p.name}</h3>
        <p className="text-sm text-gray-500">{p.category}</p>
        <p className="font-bold text-brand">{fmtPrice(p.price)} {p.currency || 'IQD'} <span className="text-xs font-normal text-gray-500">/ {p.unit}</span></p>
        <p className={'text-xs ' + (p.inStock === false ? 'text-red-600' : 'text-green-600')}>{p.inStock === false ? 'نەماوە' : 'بەردەستە'}</p>
      </div>
    </Link>
  )
}

export function State({ loading, error, empty }) {
  if (loading) return <p className="py-10 text-center text-gray-500">چاوەڕێ بکە...</p>
  if (error) return <p className="py-10 text-center text-red-600">{error}</p>
  if (empty) return <p className="py-10 text-center text-gray-500">هیچ کاڵایەک نییە</p>
  return null
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../cart'
import { fmtPrice, State } from './shared'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  useEffect(() => {
    getDoc(doc(db, 'products', id))
      .then(d => d.exists() ? setP({ id: d.id, ...d.data() }) : setError('کاڵاکە نەدۆزرایەوە'))
      .catch(() => setError('کێشەیەک ڕوویدا'))
      .finally(() => setLoading(false))
  }, [id])
  if (loading || error || !p) return <State loading={loading} error={error} />
  const out = p.inStock === false
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-200">
        {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="text-gray-500">{p.category}</p>
        <p className="text-2xl font-bold text-brand">{fmtPrice(p.price)} {p.currency || 'IQD'} <span className="text-sm font-normal text-gray-500">/ {p.unit}</span></p>
        <p className={out ? 'text-red-600' : 'text-green-600'}>{out ? 'نەماوە' : 'بەردەستە'}</p>
        <p className="whitespace-pre-line text-gray-700">{p.description}</p>
        <div className="flex items-center gap-2">
          <button className="btn-dark" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
          <input type="number" min="1" className="input w-24 text-center" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))} />
          <button className="btn-dark" onClick={() => setQty(q => q + 1)}>+</button>
        </div>
        <button className="btn w-full" disabled={out} onClick={() => { add(p, qty); nav('/order') }}>زیادکردن بۆ داواکاری</button>
      </div>
    </div>
  )
}

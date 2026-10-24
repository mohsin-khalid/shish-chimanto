import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../cart'
import { useSettings } from '../common'
import { fmtPrice } from './shared'

export default function Order() {
  const { items, remove, clear, add } = useCart()
  const s = useSettings()
  const [f, setF] = useState({ name: '', phone: '', city: '', address: '', notes: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const total = items.reduce((t, i) => t + i.price * i.qty, 0)
  const on = k => e => setF({ ...f, [k]: e.target.value })

  const text = () => `داواکاری نوێ%0Aناو: ${f.name}%0Aتەلەفۆن: ${f.phone}%0Aشار: ${f.city}%0A` +
    items.map(i => `- ${i.name} x ${i.qty} ${i.unit}`).join('%0A')

  const valid = () => {
    if (items.length === 0) return 'سەبەتەکە بەتاڵە'
    if (f.name.trim().length < 2) return 'ناوی تەواو بنووسە'
    if (!/^[0-9+\s-]{7,15}$/.test(f.phone.trim())) return 'ژمارەی تەلەفۆن دروست نییە'
    if (!f.city.trim()) return 'شار بنووسە'
    return ''
  }

  const submit = async e => {
    e.preventDefault()
    const v = valid()
    if (v) return setErr(v)
    setErr(''); setBusy(true)
    try {
      await addDoc(collection(db, 'orders'), {
        name: f.name.trim(), phone: f.phone.trim(), city: f.city.trim(),
        address: f.address.trim(), notes: f.notes.trim(),
        items, total, status: 'new', createdAt: serverTimestamp(),
      })
      clear(); setDone(true)
    } catch { setErr('ناردن سەرکەوتوو نەبوو، دووبارە هەوڵ بدەرەوە') }
    setBusy(false)
  }

  if (done) return (
    <div className="py-20 text-center">
      <p className="mb-2 text-2xl font-bold text-green-600">داواکارییەکەت نێردرا ✅</p>
      <p>بە زووترین کات پەیوەندیت پێوە دەکەین.</p>
    </div>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="mb-3 text-xl font-bold">کاڵاکانت</h2>
        {items.length === 0 && <p className="text-gray-500">سەبەتەکە بەتاڵە</p>}
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow">
              <div><p className="font-semibold">{i.name}</p><p className="text-sm text-gray-500">{i.qty} {i.unit} × {fmtPrice(i.price)}</p></div>
              <button className="text-red-600" onClick={() => remove(i.id)}>لابردن</button>
            </div>
          ))}
        </div>
        {total > 0 && <p className="mt-3 font-bold">کۆی گشتی: {fmtPrice(total)}</p>}
      </div>
      <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-bold">زانیاری کڕیار</h2>
        <input className="input" placeholder="ناو" value={f.name} onChange={on('name')} />
        <input className="input" dir="ltr" placeholder="ژمارەی تەلەفۆن" value={f.phone} onChange={on('phone')} />
        <input className="input" placeholder="شار" value={f.city} onChange={on('city')} />
        <input className="input" placeholder="ناونیشان" value={f.address} onChange={on('address')} />
        <textarea className="input" rows="3" placeholder="تێبینی" value={f.notes} onChange={on('notes')} />
        {err && <p className="text-red-600">{err}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? 'دەنێردرێت...' : 'ناردنی داواکاری'}</button>
        {s.whatsapp && items.length > 0 && (
          <a className="btn block bg-green-600 text-center" target="_blank" rel="noreferrer"
             href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${text()}`}>ناردن بە WhatsApp</a>
        )}
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, setDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, query } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { ADMIN_EMAIL, CLOUD_NAME, UPLOAD_PRESET } from '../config'
import { CATEGORIES } from '../common'

const STATUS = { new: 'نوێ', confirmed: 'پەسەندکراو', delivered: 'گەیەنراو', cancelled: 'هەڵوەشاوە' }
const EMPTY = { name: '', category: CATEGORIES[0], price: '', currency: 'IQD', unit: 'تەن', inStock: true, featured: false, description: '', image: '' }

function Login() {
  const [e, setE] = useState(''); const [p, setP] = useState(''); const [err, setErr] = useState('')
  const go = async ev => {
    ev.preventDefault(); setErr('')
    try { await signInWithEmailAndPassword(auth, e.trim(), p) } catch { setErr('ئیمەیڵ یان پاسوۆرد هەڵەیە') }
  }
  return (
    <form onSubmit={go} className="mx-auto mt-20 max-w-sm space-y-3 rounded-xl bg-white p-6 shadow">
      <h1 className="text-xl font-bold">چوونەژوورەوەی بەڕێوەبەر</h1>
      <input className="input" dir="ltr" type="email" placeholder="Email" value={e} onChange={x => setE(x.target.value)} />
      <input className="input" dir="ltr" type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} />
      {err && <p className="text-red-600">{err}</p>}
      <button className="btn w-full">چوونەژوورەوە</button>
    </form>
  )
}

async function upload(file) {
  const fd = new FormData()
  fd.append('file', file); fd.append('upload_preset', UPLOAD_PRESET)
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  if (!r.ok) throw new Error('upload')
  return (await r.json()).secure_url
}

function ProductsAdmin() {
  const [list, setList] = useState([]); const [f, setF] = useState(EMPTY); const [id, setId] = useState(null)
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const load = () => getDocs(collection(db, 'products')).then(s => setList(s.docs.map(d => ({ id: d.id, ...d.data() })))).catch(() => setMsg('هەڵە لە هێنان'))
  useEffect(() => { load() }, [])
  const on = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const save = async e => {
    e.preventDefault()
    if (!f.name.trim()) return setMsg('ناوی کاڵا بنووسە')
    setBusy(true); setMsg('')
    try {
      const data = { ...f, name: f.name.trim(), price: Number(f.price) || 0 }
      id ? await setDoc(doc(db, 'products', id), data) : await addDoc(collection(db, 'products'), data)
      setF(EMPTY); setId(null); setMsg('پاشەکەوتکرا ✅'); load()
    } catch { setMsg('پاشەکەوتکردن سەرکەوتوو نەبوو') }
    setBusy(false)
  }
  const pick = async e => {
    const file = e.target.files[0]; if (!file) return
    setMsg('وێنە بەرزدەکرێتەوە...')
    try { const url = await upload(file); setF(x => ({ ...x, image: url })); setMsg('وێنە بەرزکرایەوە ✅') }
    catch { setMsg('بەرزکردنەوەی وێنە سەرکەوتوو نەبوو (Cloudinary بپشکنە)') }
  }
  const del = async p => { if (confirm('دڵنیایت؟')) { await deleteDoc(doc(db, 'products', p.id)); load() } }
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={save} className="space-y-2 rounded-xl bg-white p-4 shadow">
        <h2 className="font-bold">{id ? 'دەستکاریکردن' : 'کاڵای نوێ'}</h2>
        <input className="input" placeholder="ناو" value={f.name} onChange={on('name')} />
        <select className="input" value={f.category} onChange={on('category')}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <div className="flex gap-2">
          <input className="input" type="number" placeholder="نرخ" value={f.price} onChange={on('price')} />
          <select className="input w-28" value={f.currency} onChange={on('currency')}><option>IQD</option><option>USD</option></select>
        </div>
        <input className="input" placeholder="یەکە (تەن، کیلۆ، کیس...)" value={f.unit} onChange={on('unit')} />
        <textarea className="input" rows="3" placeholder="پێناسە" value={f.description} onChange={on('description')} />
        <input type="file" accept="image/*" onChange={pick} />
        {f.image && <img src={f.image} alt="" className="h-24 rounded" />}
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.inStock} onChange={on('inStock')} /> بەردەستە</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured} onChange={on('featured')} /> کاڵای تایبەت</label>
        {msg && <p className="text-sm text-brand">{msg}</p>}
        <div className="flex gap-2">
          <button className="btn flex-1" disabled={busy}>پاشەکەوتکردن</button>
          {id && <button type="button" className="btn-dark" onClick={() => { setF(EMPTY); setId(null) }}>پاشگەزبوونەوە</button>}
        </div>
      </form>
      <div className="space-y-2">
        {list.map(p => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow">
            <span>{p.name}</span>
            <span className="flex gap-3 text-sm">
              <button className="text-blue-600" onClick={() => { setF({ ...EMPTY, ...p }); setId(p.id); window.scrollTo(0, 0) }}>دەستکاری</button>
              <button className="text-red-600" onClick={() => del(p)}>سڕینەوە</button>
            </span>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-500">هیچ کاڵایەک نییە</p>}
      </div>
    </div>
  )
}

function OrdersAdmin() {
  const [list, setList] = useState([]); const [err, setErr] = useState('')
  const load = () => getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
    .then(s => setList(s.docs.map(d => ({ id: d.id, ...d.data() })))).catch(() => setErr('هەڵە لە هێنانی داواکارییەکان'))
  useEffect(() => { load() }, [])
  const setStatus = async (o, status) => { await updateDoc(doc(db, 'orders', o.id), { status }); load() }
  return (
    <div className="space-y-3">
      {err && <p className="text-red-600">{err}</p>}
      {list.length === 0 && !err && <p className="text-gray-500">هیچ داواکارییەک نییە</p>}
      {list.map(o => (
        <div key={o.id} className="space-y-1 rounded-xl bg-white p-4 shadow">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <b>{o.name} - {o.city}</b>
            <select className="input w-40" value={o.status} onChange={e => setStatus(o, e.target.value)}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <a className="text-blue-600" dir="ltr" href={`tel:${o.phone}`}>📞 {o.phone}</a>
          {o.address && <p>{o.address}</p>}
          <ul className="list-disc ps-5 text-sm">{(o.items || []).map((i, k) => <li key={k}>{i.name} × {i.qty} {i.unit}</li>)}</ul>
          {o.notes && <p className="text-sm text-gray-500">تێبینی: {o.notes}</p>}
        </div>
      ))}
    </div>
  )
}

function SettingsAdmin() {
  const [s, setS] = useState({ phone: '', whatsapp: '', address: '', hours: '' }); const [msg, setMsg] = useState('')
  useEffect(() => { getDoc(doc(db, 'settings', 'main')).then(d => d.exists() && setS(x => ({ ...x, ...d.data() }))).catch(() => {}) }, [])
  const save = async e => {
    e.preventDefault()
    try { await setDoc(doc(db, 'settings', 'main'), s); setMsg('پاشەکەوتکرا ✅') } catch { setMsg('هەڵە ڕوویدا') }
  }
  const on = k => e => setS({ ...s, [k]: e.target.value })
  return (
    <form onSubmit={save} className="max-w-md space-y-2 rounded-xl bg-white p-4 shadow">
      <input className="input" dir="ltr" placeholder="ژمارەی تەلەفۆن" value={s.phone} onChange={on('phone')} />
      <input className="input" dir="ltr" placeholder="WhatsApp (بە کۆدی وڵات، وەک 9647501234567)" value={s.whatsapp} onChange={on('whatsapp')} />
      <input className="input" placeholder="ناونیشان" value={s.address} onChange={on('address')} />
      <input className="input" placeholder="کاتی کارکردن" value={s.hours} onChange={on('hours')} />
      {msg && <p className="text-brand">{msg}</p>}
      <button className="btn w-full">پاشەکەوتکردن</button>
    </form>
  )
}

export default function Admin() {
  const [user, setUser] = useState(undefined); const [tab, setTab] = useState('orders')
  useEffect(() => onAuthStateChanged(auth, setUser), [])
  if (user === undefined) return <p className="py-20 text-center">چاوەڕێ بکە...</p>
  if (!user) return <Login />
  if (user.email !== ADMIN_EMAIL) return (
    <div className="py-20 text-center"><p className="mb-3 text-red-600">ئەم ئەکاونتە ڕێگەپێدراو نییە</p><button className="btn" onClick={() => signOut(auth)}>دەرچوون</button></div>
  )
  const T = ({ k, children }) => <button onClick={() => setTab(k)} className={'rounded px-4 py-2 ' + (tab === k ? 'bg-brand text-white' : 'bg-white shadow')}>{children}</button>
  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <T k="orders">داواکارییەکان</T><T k="products">کاڵاکان</T><T k="settings">ڕێکخستن</T>
        <button className="btn-dark ms-auto" onClick={() => signOut(auth)}>دەرچوون</button>
      </div>
      {tab === 'orders' && <OrdersAdmin />}
      {tab === 'products' && <ProductsAdmin />}
      {tab === 'settings' && <SettingsAdmin />}
    </div>
  )
}

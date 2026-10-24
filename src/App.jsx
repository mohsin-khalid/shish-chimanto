import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { useSettings } from './common'
import { useCart } from './cart'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Order from './pages/Order'
import Admin from './pages/Admin'

function Header() {
  const { count } = useCart()
  const link = ({ isActive }) => 'px-3 py-1 rounded ' + (isActive ? 'bg-brand text-white' : 'hover:bg-gray-700')
  return (
    <header className="sticky top-0 z-10 bg-dark text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand">شیش و چیمەنتۆ</Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/" end className={link}>سەرەکی</NavLink>
          <NavLink to="/products" className={link}>کاڵاکان</NavLink>
          <NavLink to="/order" className={link}>داواکاری ({count})</NavLink>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const s = useSettings()
  return (
    <footer className="mt-12 bg-dark py-8 text-center text-sm text-gray-300">
      <div className="mx-auto max-w-6xl space-y-1 px-4">
        <p className="text-lg font-bold text-brand">شیش و چیمەنتۆ</p>
        {s.phone && <p>تەلەفۆن: <a dir="ltr" href={`tel:${s.phone}`}>{s.phone}</a></p>}
        {s.address && <p>ناونیشان: {s.address}</p>}
        {s.hours && <p>کاتی کار: {s.hours}</p>}
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/order" element={<Order />} />
              <Route path="*" element={<p className="py-20 text-center">پەڕەکە نەدۆزرایەوە</p>} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}

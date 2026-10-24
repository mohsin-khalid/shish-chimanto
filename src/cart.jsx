import { createContext, useContext, useEffect, useState } from 'react'
const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(items)) } catch {} }, [items])
  const add = (p, qty) => setItems(prev => {
    const ex = prev.find(i => i.id === p.id)
    if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i)
    return [...prev, { id: p.id, name: p.name, price: p.price || 0, unit: p.unit || '', qty }]
  })
  const remove = id => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])
  const count = items.reduce((s, i) => s + i.qty, 0)
  return <Ctx.Provider value={{ items, add, remove, clear, count }}>{children}</Ctx.Provider>
}

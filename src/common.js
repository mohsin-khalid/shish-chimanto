import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export const CATEGORIES = ['شیش', 'چیمەنتۆ', 'شتی تر']
export const DEFAULT_SETTINGS = { phone: '', whatsapp: '', address: '', hours: '' }

export function useSettings() {
  const [s, setS] = useState(DEFAULT_SETTINGS)
  useEffect(() => {
    getDoc(doc(db, 'settings', 'main')).then(d => d.exists() && setS({ ...DEFAULT_SETTINGS, ...d.data() })).catch(() => {})
  }, [])
  return s
}

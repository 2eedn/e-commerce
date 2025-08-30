import React, { useState } from 'react'
import { useStore } from '../state/store'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function CheckoutPage() {
  const { state, dispatch } = useStore()
  const [email, setEmail] = useState(state.guestEmail ?? '')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  async function submit() {
    setError(null)
    if (state.cart.length === 0) {
      setError('Keranjang kosong')
      return
    }
    if (!state.token && !validEmail(email)) {
      setError('Email guest tidak valid')
      return
    }
    if (!address || address.length < 5) {
      setError('Alamat harus diisi (min 5 karakter)')
      return
    }
    const items = state.cart.map(it => ({ product_id: it.product.id, quantity: it.quantity }))
    const payload: any = { shipping_address: address, items }
    if (!state.token) payload.guest_email = email
    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(state.token ? { 'Authorization': `Bearer ${state.token}` } : {})
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j.detail || 'Gagal membuat pesanan')
      return
    }
    const order = await res.json()
    dispatch({ type: 'CLEAR_CART' })
    if (!state.token) dispatch({ type: 'SET_GUEST_EMAIL', email })
    navigate(`/orders`)
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      {!state.token && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded">
          Checkout sebagai <strong>Guest</strong>. Isi email untuk melacak pesanan Anda.
        </div>
      )}
      {!state.token && (
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@email.com" />
        </div>
      )}
      <div>
        <label className="block text-sm mb-1">Alamat Pengiriman</label>
        <textarea className="w-full border rounded px-3 py-2" value={address} onChange={e => setAddress(e.target.value)} rows={3} />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Buat Pesanan</button>
    </div>
  )
}

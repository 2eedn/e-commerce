import React, { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { OrderOut } from '../types'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function OrdersPage() {
  const { state } = useStore()
  const [orders, setOrders] = useState<OrderOut[]>([])
  const [email, setEmail] = useState(state.guestEmail ?? '')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setErr(null)
      const url = state.token ? `${API}/api/orders` : `${API}/api/orders?email=${encodeURIComponent(email)}`
      const res = await fetch(url, {
        headers: { ...(state.token ? { 'Authorization': `Bearer ${state.token}` } : {}) }
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErr(j.detail || 'Gagal memuat pesanan')
        setOrders([])
        return
      }
      setOrders(await res.json())
    }
    if (state.token || email) load()
  }, [state.token, email])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pesanan Saya</h1>
      {!state.token && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1">Cek pesanan (Guest) via Email</label>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@email.com" />
          </div>
        </div>
      )}
      {err && <div className="text-red-600">{err}</div>}
      <div className="grid gap-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded shadow p-4">
            <div className="font-semibold">Order #{o.id}</div>
            <div className="text-sm text-gray-500">{o.user_id ? 'User Login' : `Guest: ${o.guest_email}`}</div>
            <div className="mt-2">Alamat: {o.shipping_address}</div>
            <div className="mt-2 font-semibold">Total: Rp {Math.round(o.total_amount).toLocaleString('id-ID')}</div>
            <div className="mt-2">
              <div className="font-medium">Item:</div>
              <ul className="list-disc ml-6">
                {o.items.map(it => <li key={it.product_id}>{it.name} x {it.quantity} @ Rp {Math.round(it.price).toLocaleString('id-ID')}</li>)}
              </ul>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-gray-500">Belum ada pesanan.</div>}
      </div>
    </div>
  )
}

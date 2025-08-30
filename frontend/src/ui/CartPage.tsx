import React from 'react'
import { useStore } from '../state/store'
import { Link } from 'react-router-dom'

export function CartPage() {
  const { state, dispatch } = useStore()
  const total = state.cart.reduce((s, it) => s + it.product.price * it.quantity, 0)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Keranjang</h1>
      <div className="bg-white rounded shadow">
        {state.cart.length === 0 && <div className="p-4 text-gray-500">Keranjang kosong</div>}
        {state.cart.map(it => (
          <div key={it.product.id} className="p-4 flex items-center gap-4 border-b">
            <img src={it.product.image_url} className="w-20 h-16 object-cover rounded" loading="lazy" />
            <div className="flex-1">
              <div className="font-medium">{it.product.name}</div>
              <div className="text-sm text-gray-500">Rp {Math.round(it.product.price).toLocaleString('id-ID')}</div>
            </div>
            <input type="number" min={1} className="w-20 border rounded px-2 py-1" value={it.quantity} onChange={e => dispatch({ type: 'SET_QTY', productId: it.product.id, quantity: Number(e.target.value) })} />
            <button className="px-2 py-1 border rounded" onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: it.product.id })}>Hapus</button>
          </div>
        ))}
        {state.cart.length > 0 && (
          <div className="p-4 flex justify-between items-center">
            <div className="font-semibold">Total: Rp {Math.round(total).toLocaleString('id-ID')}</div>
            <Link to="/checkout" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Checkout</Link>
          </div>
        )}
      </div>
    </div>
  )
}

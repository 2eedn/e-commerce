import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../types'
import { useStore } from '../state/store'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const { dispatch } = useStore()

  useEffect(() => {
    if (!id) return
    fetch(`${API}/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Produk tidak ditemukan')
        return r.json()
      })
      .then(setProduct)
      .catch(e => setErr(String(e)))
  }, [id])

  if (err) return <div className="text-red-600">{err}</div>
  if (!product) return <div>Memuat...</div>

  return (
    <div className="bg-white rounded shadow p-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src={product.image_url || `https://picsum.photos/seed/${product.id}/800/600`} loading="lazy" className="w-full h-80 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-sm text-gray-500">{product.category?.name}</div>
          <div className="mt-3 font-semibold text-xl">Rp {Math.round(product.price).toLocaleString('id-ID')}</div>
          <div className="mt-3 text-gray-700">{product.description}</div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => dispatch({ type: 'ADD_TO_CART', product })} className="px-3 py-2 bg-blue-600 text-white rounded">Tambah ke Keranjang</button>
          </div>
        </div>
      </div>
    </div>
  )
}

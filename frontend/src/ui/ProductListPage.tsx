import React, { useEffect, useMemo, useState } from 'react'
import { Product, ProductList } from '../types'
import { useStore } from '../state/store'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const DEBOUNCE_MS = 400

export function ProductListPage() {
  const { dispatch } = useStore()
  const [data, setData] = useState<ProductList | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [q, setQ] = useState('')
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('page_size', String(pageSize))
    if (categoryId !== '') params.set('category_id', String(categoryId))
    if (priceMin) params.set('price_min', priceMin)
    if (priceMax) params.set('price_max', priceMax)
    if (sort) params.set('sort', sort)
    if (q) params.set('q', q)
    return params.toString()
  }, [page, pageSize, categoryId, priceMin, priceMax, sort, q])

  useEffect(() => {
    const handle = setTimeout(() => {
      fetch(`${API}/api/products?${query}`)
        .then(r => r.json())
        .then(setData)
        .catch(() => setData(null))
    }, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Daftar Produk</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow">
        <input
          className="border rounded px-3 py-2"
          placeholder="Cari..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2"
          placeholder="Harga min"
          type="number"
          value={priceMin}
          onChange={e => setPriceMin(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Harga max"
          type="number"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="">Urutkan</option>
          <option value="price_asc">Harga Termurah</option>
          <option value="price_desc">Harga Termahal</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.items.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={() => dispatch({ type: 'ADD_TO_CART', product: p })}
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          className="px-3 py-2 bg-white border rounded shadow disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
        >
          Sebelumnya
        </button>
        <div>
          Hal {data?.page ?? page} /{' '}
          {data ? Math.max(1, Math.ceil(data.total / (data.page_size || pageSize))) : 1}
        </div>
        <button
          className="px-3 py-2 bg-white border rounded shadow disabled:opacity-50"
          disabled={data ? data.page * data.page_size >= data.total : true}
          onClick={() => setPage(p => p + 1)}
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}

const ProductCard = React.memo(function ProductCard({
  product,
  onAdd,
}: {
  product: Product
  onAdd: () => void
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <img
        src={product.image_url || `https://picsum.photos/seed/${product.id}/600/400`}
        loading="lazy"
        className="w-full h-40 object-cover"
      />
      <div className="p-3 flex-1 flex flex-col">
        <Link
          to={`/product/${product.id}`}
          className="font-medium line-clamp-2 hover:underline"
        >
          {product.name}
        </Link>
        <div className="text-sm text-gray-500 flex-1">{product.category?.name}</div>
        <div className="mt-2 font-semibold">
          Rp {Math.round(product.price).toLocaleString('id-ID')}
        </div>
        <button
          className="mt-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onAdd}
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
})

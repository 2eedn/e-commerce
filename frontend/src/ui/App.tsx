import React from 'react'
import { StoreProvider, useStore } from '../state/store'
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import { ProductListPage } from './ProductListPage'
import { ProductDetailPage } from './ProductDetailPage'
import { CartPage } from './CartPage'
import { CheckoutPage } from './CheckoutPage'
import { OrdersPage } from './OrdersPage'
import { LoginPage } from './LoginPage'

function Layout() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({ type: 'SET_TOKEN', token: null })
    dispatch({ type: 'SET_GUEST_EMAIL', email: null })
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Mini E-Commerce</Link>
          <nav className="space-x-4 flex items-center">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold' : ''}>Produk</NavLink>
            <NavLink to="/orders" className={({isActive}) => isActive ? 'font-semibold' : ''}>Pesanan</NavLink>
            <NavLink to="/cart" className={({isActive}) => isActive ? 'font-semibold' : ''}>Keranjang</NavLink>

            {state.token ? (
              <>
                <span className="text-gray-700">Welcome, {state.guestEmail || 'User'}</span>
                <button 
                  onClick={handleLogout} 
                  className="ml-3 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={({isActive}) => isActive ? 'font-semibold' : ''}>Login</NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<ProductListPage/>} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/product/:id" element={<ProductDetailPage/>} />
            <Route path="/checkout" element={<CheckoutPage/>} />
            <Route path="/orders" element={<OrdersPage/>} />
            <Route path="/login" element={<LoginPage/>} />
          </Routes>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Mini E-Commerce | create : Muhammad Zidan
      </footer>
    </div>
  )
}

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </StoreProvider>
  )
}

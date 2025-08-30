import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreProvider'

export default function Login() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Redirect kalau sudah login
  useEffect(() => {
    if (state.token) {
      navigate("/") // arahkan ke home
    }
  }, [state.token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError("⚠️ Password minimal 6 karakter")
      return
    }

    try {
      // 👉 contoh login API, ganti URL dengan backend kamu
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError("❌ Login gagal, cek email/password")
        return
      }

      const data = await res.json()
      dispatch({ type: "SET_TOKEN", token: data.token })

      alert(`✅ Welcome ${data.user.name}`) // pesan sukses
      navigate("/") // redirect ke home
    } catch (err) {
      console.error(err)
      setError("Terjadi error saat login")
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 karakter)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

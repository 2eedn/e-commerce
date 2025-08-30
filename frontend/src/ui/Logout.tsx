import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreProvider'

export default function Logout() {
  const { dispatch } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch({ type: "LOGOUT" }) // reset semua state
    navigate("/login") // balik ke login
  }, [dispatch, navigate])

  return (
    <div className="p-4 text-center">
      <p>🔄 Logging out...</p>
    </div>
  )
}

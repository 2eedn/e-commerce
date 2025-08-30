import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react'
import { CartItem, Product } from '../types'

type State = {
  cart: CartItem[]
  token: string | null
  guestEmail: string | null
}

type Action =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'SET_QTY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TOKEN'; token: string | null }
  | { type: 'SET_GUEST_EMAIL'; email: string | null }
  | { type: 'LOGOUT' }   // 🔥 tambahan

const initialState: State = {
  cart: [],
  token: null,
  guestEmail: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(c => c.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(c =>
            c.product.id === action.product.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.product, quantity: 1 }],
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(c => c.product.id !== action.productId),
      }

    case 'SET_QTY':
      return {
        ...state,
        cart: state.cart.map(c =>
          c.product.id === action.productId
            ? { ...c, quantity: Math.max(1, action.quantity) }
            : c
        ),
      }

    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'SET_TOKEN':
      return { ...state, token: action.token }

    case 'SET_GUEST_EMAIL':
      return { ...state, guestEmail: action.email }

    case 'LOGOUT':
      return { ...initialState }   // 🔥 reset ke kondisi awal

    default:
      return state
  }
}

const Ctx = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, init => {
    try {
      const saved = localStorage.getItem('app_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...init, ...parsed }
      }
    } catch (err) {
      console.warn('⚠️ Failed to parse localStorage state:', err)
    }
    return init
  })

  useEffect(() => {
    try {
      localStorage.setItem('app_state', JSON.stringify(state))
    } catch (err) {
      console.warn('⚠️ Failed to save state to localStorage:', err)
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  return useContext(Ctx)
}

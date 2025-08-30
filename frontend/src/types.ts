export interface Category {
  id: number
  name: string
}
export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image_url?: string
  stock: number
  category?: Category
}
export interface ProductList {
  items: Product[]
  page: number
  page_size: number
  total: number
}
export interface CartItem {
  product: Product
  quantity: number
}
export interface OrderItemOut {
  product_id: number
  name: string
  quantity: number
  price: number
}
export interface OrderOut {
  id: number
  user_id?: number | null
  guest_email?: string | null
  shipping_address: string
  total_amount: number
  items: OrderItemOut[]
}

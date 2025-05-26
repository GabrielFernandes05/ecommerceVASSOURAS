export interface User {
    id: number
    email: string
    name: string
    address?: string
    is_active: boolean
    is_superuser: boolean
    created_at: string
    updated_at: string
}

export interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
    image_url?: string
    active: boolean
    created_at: string
    updated_at: string
    categories: Category[]
}

export interface Category {
    id: number
    name: string
    description?: string
}

export interface CartItem {
    id: number
    product: Product
    quantity: number
}

export interface Cart {
    id: number
    user_id: number
    items: CartItem[]
    created_at: string
    updated_at: string
}

export interface Order {
    id: number
    user_id: number
    total_amount: number
    status: string
    shipping_address: string
    payment_method: string
    created_at: string
    updated_at: string
    items: OrderItem[]
}

export interface OrderItem {
    id: number
    order_id: number
    product: Product
    quantity: number
    unit_price: number
}

export interface AuthResponse {
    access_token: string
    token_type: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
    address?: string
}

export interface LoginData {
    username: string
    password: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
    status: number
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    size: number
    pages: number
}
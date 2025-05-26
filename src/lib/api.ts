import axios, { AxiosError, AxiosResponse } from 'axios'
import { AuthResponse, LoginData, RegisterData, User, Product, Category, Cart, Order } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
    private client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
    })

    constructor() {
        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
            return config
        })

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token')
                        window.location.href = '/login'
                    }
                }
                return Promise.reject(error)
            }
        )
    }

    async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get(url, { params })
        return response.data
    }

    async post<T>(url: string, data?: any, headers?: any): Promise<T> {
        const response = await this.client.post(url, data, { headers })
        return response.data
    }

    async put<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.put(url, data)
        return response.data
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete(url)
        return response.data
    }
}

const apiClient = new ApiClient()

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        return apiClient.post('/auth/login', data, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    async register(data: RegisterData): Promise<User> {
        return apiClient.post('/users/register', data)
    },

    async getCurrentUser(): Promise<User> {
        return apiClient.get('/users/me')
    },

    async updateCurrentUser(data: Partial<User>): Promise<User> {
        return apiClient.put('/users/me', data)
    }
}

export const productService = {
    async getProducts(params?: {
        skip?: number
        limit?: number
        category?: number
        search?: string
    }): Promise<Product[]> {
        return apiClient.get('/products', params)
    },

    async getProduct(id: number): Promise<Product> {
        return apiClient.get(`/products/${id}`)
    },

    async createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
        return apiClient.post('/products', data)
    },

    async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
        return apiClient.put(`/products/${id}`, data)
    },

    async deleteProduct(id: number): Promise<void> {
        return apiClient.delete(`/products/${id}`)
    }
}

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        return apiClient.get('/categories')
    },

    async getCategory(id: number): Promise<Category> {
        return apiClient.get(`/categories/${id}`)
    },

    async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
        return apiClient.post('/categories', data)
    },

    async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
        return apiClient.put(`/categories/${id}`, data)
    },

    async deleteCategory(id: number): Promise<void> {
        return apiClient.delete(`/categories/${id}`)
    }
}

export const cartService = {
    async getCart(): Promise<Cart> {
        return apiClient.get('/cart')
    },

    async addItem(productId: number, quantity: number): Promise<Cart> {
        return apiClient.post('/cart/items', { product_id: productId, quantity })
    },

    async updateItem(itemId: number, quantity: number): Promise<Cart> {
        return apiClient.put(`/cart/items/${itemId}`, { quantity })
    },

    async removeItem(itemId: number): Promise<void> {
        return apiClient.delete(`/cart/items/${itemId}`)
    },

    async clearCart(): Promise<void> {
        return apiClient.delete('/cart')
    }
}

export const orderService = {
    async getOrders(params?: { skip?: number; limit?: number }): Promise<Order[]> {
        return apiClient.get('/orders', params)
    },

    async getOrder(id: number): Promise<Order> {
        return apiClient.get(`/orders/${id}`)
    },

    async createOrder(data: { shipping_address: string; payment_method: string }): Promise<Order> {
        return apiClient.post('/orders', data)
    },

    async updateOrderStatus(id: number, status: string): Promise<Order> {
        return apiClient.put(`/orders/${id}/status`, { status })
    }
}
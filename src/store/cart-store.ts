import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/types'

interface CartState {
    items: CartItem[]
    isLoading: boolean
    addItem: (product: Product, quantity: number) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    setLoading: (loading: boolean) => void
    setItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: (product: Product, quantity: number) => {
                const state = get()
                const existingItem = state.items.find(item => item.product.id === product.id)

                if (existingItem) {
                    set({
                        items: state.items.map(item =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    })
                } else {
                    const newItem: CartItem = {
                        id: Date.now(),
                        product,
                        quantity
                    }
                    set({
                        items: [...state.items, newItem]
                    })
                }
            },

            removeItem: (productId: number) => {
                const state = get()
                set({
                    items: state.items.filter(item => item.product.id !== productId)
                })
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                const state = get()
                set({
                    items: state.items.map(item =>
                        item.product.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            getTotalItems: () => {
                const state = get()
                return state.items.reduce((total, item) => total + item.quantity, 0)
            },

            getTotalPrice: () => {
                const state = get()
                return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            setItems: (items: CartItem[]) => {
                set({ items })
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
            }),
        }
    )
)
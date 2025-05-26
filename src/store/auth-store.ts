import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
    setUser: (user: User) => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: (token: string, user: User) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('access_token', token)
                }
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isLoading: false
                })
            },

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token')
                }
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            },

            setUser: (user: User) => {
                set({ user })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
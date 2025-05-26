'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { useCartStore } from '@/store/cart-store'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getTotalItems } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')

  const totalItems = getTotalItems()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">E-commerce</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Produtos
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Categorias
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Cadastrar</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
'use client'

import { useState, useMemo } from 'react'
import { Product, Category } from '@/types'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal } from 'lucide-react'

interface ProductListProps {
  products: Product[]
  categories: Category[]
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'newest'

export function ProductList({ products: initialProducts, categories }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === null || 
                             product.categories.some(cat => cat.id === selectedCategory)
      return matchesSearch && matchesCategory && product.active
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [initialProducts, searchTerm, selectedCategory, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className={`flex flex-col gap-2 md:flex-row md:items-center ${showFilters ? 'block' : 'hidden md:flex'}`}>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="newest">Mais recentes</option>
            <option value="name">Nome A-Z</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredAndSortedProducts.length} produto(s) encontrado(s)
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">😕</div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
        </div>
      )}
    </div>
  )
}
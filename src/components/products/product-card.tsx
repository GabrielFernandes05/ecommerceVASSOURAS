'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { ShoppingCart, Star } from 'lucide-react'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product, 1)
    }

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                    <Image
                        src={product.image_url || '/placeholder-product.jpg'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                </div>
            </Link>
            <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="mb-2 line-clamp-2 font-semibold text-sm hover:text-primary">
                        {product.name}
                    </h3>
                </Link>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.5</span>
                    </div>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                    <p className="mt-2 text-xs text-orange-600">
                        Restam apenas {product.stock} unidades
                    </p>
                )}
                {product.stock === 0 && (
                    <p className="mt-2 text-xs text-red-600">
                        Produto indisponível
                    </p>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Button>
            </CardFooter>
        </Card>
    )
}
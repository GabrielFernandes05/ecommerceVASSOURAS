'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Truck, Shield, RotateCcw, Star } from 'lucide-react'

export default function Home() {
    return (
        <div className="flex flex-col">
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                        Bem-vindo à nossa Loja
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                        Descubra produtos incríveis com a melhor qualidade e preços que cabem no seu bolso.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            <Link href="/products">Explorar Produtos</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                            <Link href="/login">Fazer Login</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Produtos em Destaque</h2>
                        <p className="text-muted-foreground">Selecionamos os melhores produtos para você</p>
                    </div>

                    <div className="text-center text-muted-foreground">
                        <div className="mb-4 text-6xl">🛍️</div>
                        <h3 className="mb-2 text-lg font-semibold">Produtos em breve</h3>
                        <p>Estamos preparando uma seleção incrível para você!</p>
                    </div>

                    <div className="mt-12 text-center">
                        <Button asChild variant="outline">
                            <Link href="/products">Ver Todos os Produtos</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                                <Truck className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Entrega Rápida</h3>
                            <p className="text-muted-foreground">Receba seus produtos em até 24 horas</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                                <Shield className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Compra Segura</h3>
                            <p className="text-muted-foreground">Seus dados protegidos com criptografia</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                                <RotateCcw className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Devolução Fácil</h3>
                            <p className="text-muted-foreground">30 dias para trocas e devoluções</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="mb-4 text-3xl font-bold">O que nossos clientes dizem</h2>
                        <div className="flex justify-center space-x-1 mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-lg text-muted-foreground">
                            "Excelente qualidade dos produtos e entrega super rápida. Recomendo!"
                        </p>
                        <p className="mt-4 font-semibold">- Maria Silva</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
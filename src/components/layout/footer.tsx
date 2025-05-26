import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">E-commerce</h3>
                        <p className="text-sm text-muted-foreground">
                            A melhor experiência de compras online com produtos de qualidade e entrega rápida.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Categorias</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products?category=electronics" className="text-muted-foreground hover:text-foreground">
                                    Eletrônicos
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=clothing" className="text-muted-foreground hover:text-foreground">
                                    Roupas
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=books" className="text-muted-foreground hover:text-foreground">
                                    Livros
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=home" className="text-muted-foreground hover:text-foreground">
                                    Casa
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Atendimento</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                                    Central de Ajuda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                                    Contato
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                                    Entregas
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                                    Devoluções
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Institucional</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                    Sobre
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                                    Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                                    Termos
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
                    © 2024 E-commerce. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    )
}
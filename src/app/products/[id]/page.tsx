"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductService } from "@/services/axiosService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/header";
import CartForm from "@/components/forms/cartForm";
import { useCart } from "@/hooks/useCart";


export default function ProductDetail() {
    const [username, setUsername] = useState<string | null>(null);
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { getProductQuantityInCart } = useCart();

    useEffect(() => {
        if (id) {
            setLoading(true);
            const productService = new ProductService();
            productService.getProduct(Number(id))
                .then(response => {
                    setProduct(response.data);
                })
                .catch(() => setProduct(null))
                .finally(() => setLoading(false));
        }
        setUsername(localStorage.getItem("username"));
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="p-8">Carregando produto...</div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <Card className="w-full max-w-lg">
                        <CardContent className="text-center p-8">
                            <p className="text-gray-500">Produto não encontrado.</p>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const currentCartQuantity = getProductQuantityInCart(product.id);
    const availableStock = product.stock;
    const isSoldOut = availableStock <= 0;

    return (
        <>
            <Header />
            <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-2xl">{product.name}</CardTitle>
                            {isSoldOut && (
                                <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-red-500 text-white">
                                    ESGOTADO
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className={`w-64 h-64 object-cover rounded-md mx-auto ${isSoldOut ? 'grayscale opacity-75' : ''
                                    }`}
                            />
                            {isSoldOut && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600 bg-opacity-90 text-white px-4 py-2 rounded-lg font-bold">
                                        PRODUTO ESGOTADO
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <p className="text-gray-700">
                                <span className="font-semibold">Descrição:</span> {product.description}
                            </p>

                            <p className="font-bold text-xl text-green-600">
                                Preço: R$ {product.price.toFixed(2)}
                            </p>

                            <div className="flex items-center gap-4">
                                <div>
                                    {isSoldOut ? (
                                        <p className="text-red-600 font-semibold">
                                            Estoque: Esgotado
                                        </p>
                                    ) : (
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Estoque disponível:</span> {availableStock}
                                        </p>
                                    )}
                                </div>

                                {currentCartQuantity > 0 && !isSoldOut && (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-gray-100 text-gray-900">
                                        {currentCartQuantity} no carrinho
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-center pt-4">
                                {username && !isSoldOut ? (
                                    <CartForm
                                        productId={product.id}
                                        quantityMax={product.stock}
                                        currentCartQuantity={currentCartQuantity}
                                    />
                                ) : isSoldOut ? (
                                    <div className="text-center text-gray-500">
                                        <p className="text-sm">Este produto não está mais disponível</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <p className="text-sm">Faça login para adicionar ao carrinho</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
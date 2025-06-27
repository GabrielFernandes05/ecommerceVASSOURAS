"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartService } from "@/services/axiosService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, CreditCard, ArrowLeft } from "lucide-react";

export default function CartPage() {
    const cartService = new CartService();
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart && cart.items) {
            const quantities: { [key: number]: number } = {};
            cart.items.forEach((item: any) => {
                quantities[item.id] = item.quantity;
            });
            setLocalQuantities(quantities);
        }
    }, [cart]);

    const fetchCart = () => {
        setLoading(true);
        cartService.getCart()
            .then(response => setCart(response.data))
            .catch(() => setCart(null))
            .finally(() => setLoading(false));
    };

    const handleRemove = (itemId: number) => {
        setUpdating(true);
        cartService.removeItemFromCart(itemId)
            .then(fetchCart)
            .finally(() => setUpdating(false));
    };

    const handleUpdate = (itemId: number, quantity: number) => {
        // Encontrar o item para verificar se a quantidade é válida
        const item = cart.items.find((item: any) => item.id === itemId);
        if (item && quantity > item.product.stock) {
            alert(`Quantidade excede o estoque disponível (${item.product.stock})`);
            // Restaurar a quantidade anterior
            setLocalQuantities(prev => ({ ...prev, [itemId]: item.quantity }));
            return;
        }

        setUpdating(true);
        cartService.updateCartItem(itemId, quantity)
            .then(fetchCart)
            .catch(error => {
                const errorMessage = error.response?.data?.detail || "Erro ao atualizar item do carrinho.";
                alert(errorMessage);
                // Restaurar a quantidade anterior em caso de erro
                if (item) {
                    setLocalQuantities(prev => ({ ...prev, [itemId]: item.quantity }));
                }
            })
            .finally(() => setUpdating(false));
    };

    const handleClear = () => {
        setUpdating(true);
        cartService.clearCart()
            .then(fetchCart)
            .finally(() => setUpdating(false));
    };

    if (loading) return <div className="p-8">Carregando...</div>;

    return (
        <>
            <Header />
            <div className="mx-auto py-32 p-4 bg-gray-50 min-h-screen w-full flex flex-col">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6 text-red-800" />
                            <h1 className="text-3xl font-bold">Meu Carrinho</h1>
                        </div>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continuar Comprando
                        </Button>
                    </div>

                    {cart && cart.items && cart.items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Itens no Carrinho ({cart.items.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {cart.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-lg font-bold text-green-600">
                                                            R$ {item.product.price.toFixed(2)}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.product.stock} disponível
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <label className="text-sm font-medium">Quantidade</label>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={item.product.stock}
                                                            value={localQuantities[item.id] ?? item.quantity}
                                                            className="w-20 text-center"
                                                            onChange={e => {
                                                                const value = Number(e.target.value);
                                                                if (value > item.product.stock) {
                                                                    alert(`Quantidade máxima disponível: ${item.product.stock}`);
                                                                    setLocalQuantities(prev => ({ ...prev, [item.id]: item.product.stock }));
                                                                } else if (value < 1) {
                                                                    setLocalQuantities(prev => ({ ...prev, [item.id]: 1 }));
                                                                } else {
                                                                    setLocalQuantities(prev => ({ ...prev, [item.id]: value }));
                                                                }
                                                            }}
                                                            onBlur={() => handleUpdate(item.id, localQuantities[item.id] ?? item.quantity)}
                                                            disabled={updating}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-sm font-medium">Subtotal</span>
                                                        <span className="font-bold text-green-600">
                                                            R$ {(item.product.price * (localQuantities[item.id] ?? item.quantity)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemove(item.id)}
                                                        disabled={updating}
                                                        className="p-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-6">
                                    <CardHeader>
                                        <CardTitle>Resumo do Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</span>
                                                <span>R$ {cart.total?.toFixed(2) ?? '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Frete</span>
                                                <span className="text-green-600">Grátis</span>
                                            </div>
                                            <div className="border-t pt-2">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-green-600">R$ {cart.total?.toFixed(2) ?? '0.00'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Button
                                                onClick={() => router.push("/checkout")}
                                                className="w-full bg-red-800 hover:bg-red-700 text-white flex items-center gap-2"
                                                disabled={updating}
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                Finalizar Compra
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={handleClear}
                                                disabled={updating}
                                                className="w-full flex items-center gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Limpar Carrinho
                                            </Button>
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>• Frete grátis para todo o Brasil</p>
                                            <p>• Entrega em até 7 dias úteis</p>
                                            <p>• Pagamento seguro</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center space-y-4">
                                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto" />
                                    <h3 className="text-xl font-semibold text-gray-900">Seu carrinho está vazio</h3>
                                    <p className="text-gray-600">Adicione produtos ao seu carrinho para continuar comprando.</p>
                                    <Button
                                        onClick={() => router.push("/")}
                                        className="bg-red-800 hover:bg-red-700 text-white"
                                    >
                                        Começar a Comprar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

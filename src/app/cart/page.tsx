"use client";
import { useEffect, useState } from "react";
import { CartService } from "@/services/axiosService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";

export default function CartPage() {
    const cartService = new CartService();
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
        setUpdating(true);
        cartService.updateCartItem(itemId, quantity)
            .then(fetchCart)
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
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Meu Carrinho</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cart && cart.items && cart.items.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {cart.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 border-b pb-2">
                                        <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <h3 className="font-bold">{item.product.name}</h3>
                                            <p className="text-sm text-gray-600">{item.product.description}</p>
                                            <p className="text-sm">Preço: R$ {item.product.price.toFixed(2)}</p>
                                        </div>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={localQuantities[item.id] ?? item.quantity}
                                            className="w-20"
                                            onChange={e => {
                                                const value = Number(e.target.value);
                                                setLocalQuantities(prev => ({ ...prev, [item.id]: value }));
                                            }}
                                            onBlur={() => handleUpdate(item.id, localQuantities[item.id] ?? item.quantity)}
                                            disabled={updating}
                                        />
                                        <Button variant="destructive" onClick={() => handleRemove(item.id)} disabled={updating}>
                                            Remover
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-bold text-lg">Total: R$ {cart.total?.toFixed(2) ?? 0}</span>
                                    <Button variant="outline" onClick={handleClear} disabled={updating}>
                                        Limpar Carrinho
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

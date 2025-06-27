"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { CartService } from "@/services/axiosService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const cartService = new CartService();
    const router = useRouter();
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const response = await cartService.getCart();
            const cart = response.data;

            if (!cart || !cart.items || cart.items.length === 0) {
                setError("Seu carrinho está vazio");
                setLoading(false);
                return;
            }

            setCartItems(cart.items);

            // Calcular total
            const calculatedTotal = cart.items.reduce(
                (sum: number, item: any) => sum + (item.product.price * item.quantity),
                0
            );
            setTotal(calculatedTotal);
        } catch (error) {
            console.error("Erro ao carregar carrinho:", error);
            setError("Erro ao carregar carrinho");
        } finally {
            setLoading(false);
        }
    };

    const handleOrderSuccess = (orderId: number) => {
        showToast("Pedido criado com sucesso! Redirecionando...", "success");
        setTimeout(() => {
            router.push(`/orders/${orderId}?success=true`);
        }, 1500);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando checkout...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto" />
                        <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
                        <p className="text-gray-600">Adicione produtos ao seu carrinho antes de finalizar a compra.</p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={() => router.push("/cart")}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Voltar ao Carrinho
                            </Button>
                            <Button
                                onClick={() => router.push("/")}
                                className="bg-red-800 hover:bg-red-700 text-white"
                            >
                                Continuar Comprando
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="mx-auto pt-36 bg-gray-50 min-h-screen">
                <CheckoutForm
                    cartItems={cartItems}
                    total={total}
                    onOrderSuccess={handleOrderSuccess}
                />
            </div>
            <ToastContainer />
        </>
    );
}

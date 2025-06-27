"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OrderService } from "@/services/axiosService";
import { AlertCircle, CreditCard, MapPin, ShoppingBag, CheckCircle } from "lucide-react";

interface CheckoutFormProps {
    cartItems: any[];
    total: number;
    onOrderSuccess: (orderId: number) => void;
}

const CheckoutForm = ({ cartItems, total, onOrderSuccess }: CheckoutFormProps) => {
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const orderService = new OrderService();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!shippingAddress.trim()) {
            setError("Endereço de entrega é obrigatório");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await orderService.createOrder(shippingAddress, paymentMethod);
            onOrderSuccess(response.data.id);
        } catch (error: any) {
            console.error("Erro ao criar pedido:", error);
            let errorMessage = "Erro ao processar pedido. Tente novamente.";

            if (error.response?.data?.detail) {
                if (typeof error.response.data.detail === 'string') {
                    errorMessage = error.response.data.detail;
                } else if (Array.isArray(error.response.data.detail)) {
                    // Tratar erros de validação do Pydantic
                    errorMessage = error.response.data.detail.map((err: any) => err.msg).join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="h-6 w-6 text-red-800" />
                <h1 className="text-2xl font-bold">Finalizar Compra</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulário de Checkout */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Dados do Pedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Endereço de Entrega
                                </Label>
                                <textarea
                                    id="address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Digite seu endereço completo para entrega"
                                    className="w-full min-h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment">Método de Pagamento</Label>
                                <select
                                    id="payment"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="credit_card">Cartão de Crédito</option>
                                    <option value="debit_card">Cartão de Débito</option>
                                    <option value="pix">PIX</option>
                                    <option value="boleto">Boleto Bancário</option>
                                    <option value="cash_on_delivery">Pagamento na Entrega</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-800 hover:bg-red-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Processando..."
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Finalizar Pedido - R$ {total.toFixed(2)}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Resumo do Pedido */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div>
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                R$ {item.product.price.toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            R$ {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            {item.quantity} un.
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">R$ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p>• {cartItems.length} item(ns) no pedido</p>
                            <p>• Entrega será realizada no endereço informado</p>
                            <p>• Você receberá uma confirmação por email</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutForm;

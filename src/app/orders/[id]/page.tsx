"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderService } from "@/services/axiosService";
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowLeft, Home } from "lucide-react";

interface OrderPageProps {
    params: {
        id: string;
    };
}

export default function OrderPage({ params }: OrderPageProps) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const orderService = new OrderService();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSuccess = searchParams?.get("success") === "true";

    useEffect(() => {
        loadOrder();
    }, [params.id]);

    const loadOrder = async () => {
        try {
            const response = await orderService.getOrder(Number(params.id));
            setOrder(response.data);
        } catch (error) {
            console.error("Erro ao carregar pedido:", error);
            setError("Pedido não encontrado");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { variant: "secondary" as const, label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
            confirmed: { variant: "default" as const, label: "Confirmado", color: "bg-blue-100 text-blue-800" },
            shipped: { variant: "default" as const, label: "Enviado", color: "bg-purple-100 text-purple-800" },
            delivered: { variant: "default" as const, label: "Entregue", color: "bg-green-100 text-green-800" },
            cancelled: { variant: "destructive" as const, label: "Cancelado", color: "bg-red-100 text-red-800" }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando pedido...</p>
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
                        <Package className="h-16 w-16 text-gray-400 mx-auto" />
                        <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
                        <Button
                            onClick={() => router.push("/orders")}
                            className="bg-red-800 hover:bg-red-700 text-white"
                        >
                            Ver Meus Pedidos
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen">
                {/* Banner de sucesso quando vem do checkout */}
                {isSuccess && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                                <div>
                                    <h3 className="text-green-800 font-medium">Pedido criado com sucesso!</h3>
                                    <p className="text-green-700 text-sm mt-1">
                                        Seu pedido foi processado e você receberá atualizações sobre o status de entrega.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Success Message */}
                    {isSuccess && (
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-800">Pedido realizado com sucesso!</h3>
                                        <p className="text-green-600">Seu pedido foi processado e você receberá atualizações por email.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-6 w-6" />
                                        Pedido #{order.id}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(order.status)}
                                    <p className="text-2xl font-bold text-green-600 mt-1">
                                        R$ {order.total_amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Itens do Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                <Package className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{item.product_name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    R$ {item.unit_price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                R$ {(item.unit_price * item.quantity).toFixed(2)}
                                            </p>
                                            <Badge variant="outline" className="text-xs">
                                                {item.quantity} un.
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes do Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4" />
                                        Endereço de Entrega
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        {order.shipping_address}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <CreditCard className="h-4 w-4" />
                                        Método de Pagamento
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {order.payment_method === "credit_card" && "Cartão de Crédito"}
                                        {order.payment_method === "debit_card" && "Cartão de Débito"}
                                        {order.payment_method === "pix" && "PIX"}
                                        {order.payment_method === "boleto" && "Boleto Bancário"}
                                        {order.payment_method === "cash_on_delivery" && "Pagamento na Entrega"}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total do Pedido:</span>
                                        <span className="text-green-600">R$ {order.total_amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => router.push("/orders")}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Meus Pedidos
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-red-800 hover:bg-red-700 text-white flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Continuar Comprando
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

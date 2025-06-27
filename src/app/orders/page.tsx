"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderService } from "@/services/axiosService";
import { Package, Calendar, Eye, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const orderService = new OrderService();
    const router = useRouter();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await orderService.getOrders();
            setOrders(response.data.items);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            setError("Erro ao carregar pedidos");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
            confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
            shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
            delivered: { label: "Entregue", color: "bg-green-100 text-green-800" },
            cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" }
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
                        <p className="text-gray-600">Carregando pedidos...</p>
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
                            onClick={() => loadOrders()}
                            className="bg-red-800 hover:bg-red-700 text-white"
                        >
                            Tentar Novamente
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
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6 text-red-800" />
                            <h1 className="text-3xl font-bold">Meus Pedidos</h1>
                        </div>
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-red-800 hover:bg-red-700 text-white"
                        >
                            Continuar Comprando
                        </Button>
                    </div>

                    {orders.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center space-y-4">
                                    <Package className="h-16 w-16 text-gray-400 mx-auto" />
                                    <h3 className="text-xl font-semibold text-gray-900">Nenhum pedido encontrado</h3>
                                    <p className="text-gray-600">Você ainda não fez nenhum pedido. Que tal começar a comprar?</p>
                                    <Button
                                        onClick={() => router.push("/")}
                                        className="bg-red-800 hover:bg-red-700 text-white"
                                    >
                                        Começar a Comprar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-red-100 p-3 rounded-full">
                                                    <Package className="h-6 w-6 text-red-800" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2">
                                                {getStatusBadge(order.status)}
                                                <p className="text-xl font-bold text-green-600">
                                                    R$ {order.total_amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <Button
                                                onClick={() => router.push(`/orders/${order.id}`)}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver Detalhes
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

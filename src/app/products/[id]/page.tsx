"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductService } from "@/services/axiosService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/header";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const productService = new ProductService();
            productService.getProduct(Number(id))
                .then(response => setProduct(response.data))
                .catch(() => setProduct(null));
        }
    }, [id]);

    if (!product) {
        return <div className="p-8">Carregando...</div>;
    }

    return (
        <>
            <Header />
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-64 h-64 object-cover rounded-md mb-4 mx-auto"
                        />
                        <p className="mb-2">Descrição: {product.description}</p>
                        <p className="font-bold text-lg mb-2">Preço: R$ {product.price}</p>
                        <p>Estoque: {product.stock}</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
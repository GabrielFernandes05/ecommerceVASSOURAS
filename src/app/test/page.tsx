"use client";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/axiosService";

export default function TestPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [includeInactive, setIncludeInactive] = useState(false);
    const productService = new ProductService();

    const loadProducts = async () => {
        try {
            const response = await productService.getProducts(0, 100, undefined, undefined, includeInactive);
            const userProducts = response.data.items.filter((product: any) =>
                product.created_by_id.toString() === localStorage.getItem("user_id")
            );
            setProducts(userProducts);
            console.log("Produtos carregados:", userProducts.length);
            console.log("Produtos inativos:", userProducts.filter((p: any) => !p.is_active).length);
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [includeInactive]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Teste de Produtos Inativos</h1>

            <div className="mb-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={includeInactive}
                        onChange={(e) => setIncludeInactive(e.target.checked)}
                    />
                    Incluir produtos inativos
                </label>
            </div>

            <div className="space-y-2">
                <p>User ID no localStorage: {localStorage.getItem("user_id")}</p>
                <p>Total de produtos: {products.length}</p>
                <p>Produtos ativos: {products.filter(p => p.is_active).length}</p>
                <p>Produtos inativos: {products.filter(p => !p.is_active).length}</p>
            </div>

            <div className="mt-4 grid gap-2">
                {products.map((product: any) => (
                    <div
                        key={product.id}
                        className={`p-3 rounded border ${product.is_active ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                        <strong>{product.name}</strong> -
                        ID: {product.id} -
                        Ativo: {product.is_active ? 'Sim' : 'Não'} -
                        Criado por: {product.created_by_id}
                    </div>
                ))}
            </div>
        </div>
    );
}

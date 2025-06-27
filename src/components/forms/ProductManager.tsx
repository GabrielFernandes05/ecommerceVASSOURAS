"use client";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, EyeOff, Trash2, Package, DollarSign, AlertTriangle } from "lucide-react";

interface ProductManagerProps {
    product: any;
    onProductUpdated: () => void;
    productService: any;
}

const ProductManager = ({ product, onProductUpdated, productService }: ProductManagerProps) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newStock, setNewStock] = useState(product.stock);
    const [newPrice, setNewPrice] = useState(product.price);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateStock = async () => {
        if (newStock < 0) {
            setError("O estoque não pode ser negativo.");
            return;
        }
        if (newPrice < 0) {
            setError("O preço não pode ser negativo.");
            return;
        }

        setUpdating(true);
        setError(null);
        try {
            await productService.updateProduct(product.id, {
                stock: newStock,
                price: newPrice
            });
            alert("Produto atualizado com sucesso!");
            setEditDialogOpen(false);
            onProductUpdated();
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || "Erro ao atualizar produto.";
            setError(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    const handleToggleActive = async () => {
        setUpdating(true);
        try {
            await productService.updateProduct(product.id, {
                is_active: !product.is_active
            });
            alert(`Produto ${product.is_active ? 'desativado' : 'reativado'} com sucesso!`);
            onProductUpdated();
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || "Erro ao alterar status do produto.";
            alert(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteProduct = async () => {
        setUpdating(true);
        try {
            await productService.deleteProduct(product.id);
            alert("Produto excluído com sucesso!");
            setDeleteDialogOpen(false);
            onProductUpdated();
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || "Erro ao excluir produto.";
            alert(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    const resetForm = () => {
        setNewStock(product.stock);
        setNewPrice(product.price);
        setError(null);
    };

    return (
        <div className="w-full">
            {/* Status badges */}
            <div className="flex gap-2 mt-3 mb-2 justify-center flex-wrap">
                <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Ativo" : "Inativo"}
                </Badge>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    <Package className="h-3 w-3 mr-1" />
                    {product.stock} em estoque
                </Badge>
                <Badge variant="outline">
                    <DollarSign className="h-3 w-3 mr-1" />
                    R$ {product.price.toFixed(2)}
                </Badge>
            </div>

            {/* Management buttons */}
            <div className="flex gap-2 mt-2 justify-center">
                {/* Botão Editar */}
                <AlertDialog open={editDialogOpen} onOpenChange={(open) => {
                    setEditDialogOpen(open);
                    if (open) resetForm();
                }}>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2" title="Editar produto">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Editar Produto</AlertDialogTitle>
                            <Card>
                                <CardHeader>
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-600">{product.description}</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Estoque</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={newStock}
                                            onChange={(e) => setNewStock(Number(e.target.value))}
                                            placeholder="Quantidade em estoque"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={newPrice}
                                            onChange={(e) => setNewPrice(Number(e.target.value))}
                                            placeholder="Preço do produto"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="bg-gray-50 rounded-md p-3">
                                        <h4 className="text-sm font-medium mb-2">Valores atuais:</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>• Estoque: {product.stock}</p>
                                            <p>• Preço: R$ {product.price.toFixed(2)}</p>
                                            <p>• Status: {product.is_active ? 'Ativo' : 'Inativo'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setError(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUpdateStock} disabled={updating}>
                                {updating ? "Salvando..." : "Salvar Alterações"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Botão Ativar/Desativar */}
                <Button
                    size="sm"
                    variant={product.is_active ? "outline" : "default"}
                    className="p-2"
                    onClick={handleToggleActive}
                    disabled={updating}
                    title={product.is_active ? "Retirar da loja" : "Colocar na loja"}
                >
                    {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                {/* Botão Excluir */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="p-2" title="Excluir produto">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                            <div className="py-4 space-y-3">
                                <p>Tem certeza que deseja excluir permanentemente o produto:</p>
                                <div className="bg-gray-50 rounded-md p-3">
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-gray-600">{product.description}</p>
                                    <p className="text-sm text-gray-600">Preço: R$ {product.price.toFixed(2)}</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-600 font-medium">
                                            Esta ação não pode ser desfeita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteProduct}
                                disabled={updating}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {updating ? "Excluindo..." : "Excluir Produto"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default ProductManager;

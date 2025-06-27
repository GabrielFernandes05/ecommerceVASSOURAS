"use client";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import { CartService } from "@/services/axiosService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const cartService = new CartService();

interface CartFormProps {
    productId: number;
    quantityMax: number;
    currentCartQuantity?: number; // Quantidade já no carrinho para este produto
}

const CartForm = ({ productId, quantityMax, currentCartQuantity = 0 }: CartFormProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [open, setOpen] = useState(false);

    // Calcular quantidade máxima disponível considerando o que já está no carrinho
    const availableQuantity = Math.max(0, quantityMax - currentCartQuantity);

    const addProductToCart = () => {
        if (quantity < 1) {
            alert("Quantidade deve ser maior que zero.");
            return;
        }

        if (quantity > availableQuantity) {
            alert(`Quantidade indisponível. Máximo disponível: ${availableQuantity} (${currentCartQuantity} já no carrinho)`);
            return;
        }

        cartService.addItemToCart(productId, quantity)
            .then(response => {
                alert("Produto adicionado ao carrinho com sucesso!");
                setOpen(false);
                // Resetar quantidade para 1
                setQuantity(1);
            })
            .catch(error => {
                const errorMessage = error.response?.data?.detail || "Erro ao adicionar produto ao carrinho.";
                alert(errorMessage);
            });
    };

    // Se não há estoque disponível, não mostrar o botão
    if (availableQuantity <= 0) {
        return (
            <Button disabled className="mt-2 bg-gray-400 text-white cursor-not-allowed">
                <ShoppingCart />
                Sem Estoque
            </Button>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="mt-2 bg-red-800 text-white hover:bg-red-700">
                    <ShoppingCart />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Confirmar Compra</AlertDialogTitle>
                    <div>
                        <Card>
                            <CardHeader>
                                <div>
                                    <p>Quantos itens você deseja comprar?</p>
                                    {currentCartQuantity > 0 && (
                                        <p className="text-sm text-amber-600 mt-1">
                                            Já há {currentCartQuantity} item(s) no seu carrinho
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Disponível: {availableQuantity}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <Input
                                    type="number"
                                    min={1}
                                    max={availableQuantity}
                                    value={quantity}
                                    placeholder={`Quantidade (máx. ${availableQuantity})`}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value > availableQuantity) {
                                            alert(`Quantidade máxima disponível é ${availableQuantity}`);
                                            setQuantity(availableQuantity);
                                        } else if (value < 1) {
                                            setQuantity(1);
                                        } else {
                                            setQuantity(value);
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={addProductToCart}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CartForm;
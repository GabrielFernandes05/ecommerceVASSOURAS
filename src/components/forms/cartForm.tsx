"use client";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CartService } from "@/services/axiosService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const cartService = new CartService();

interface CartFormProps {
    productId: number;
    quantityMax: number;
}

const CartForm = ({ productId, quantityMax }: CartFormProps) => {
    const [quantity, setQuantity] = useState<number>(1);

    const addProductToCart = () => {
        if (quantity < 1 || quantity > quantityMax) {
            alert(`Quantidade inválida. Deve ser entre 1 e ${quantityMax}.`);
            return;
        }
        cartService.addItemToCart(productId, quantity)
            .then(response => {
                alert("Produto adicionado ao carrinho com sucesso!");
            })
            .catch(error => {
                alert("Erro ao adicionar produto ao carrinho.");
            });
    };

    return (
        <AlertDialog>
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
                            <CardHeader>Quantos itens você deseja comprar?</CardHeader>
                            <CardContent className="grid gap-4">
                                <Input
                                    type="number"
                                    min={1}
                                    max={quantityMax}
                                    value={quantity}
                                    placeholder={`Quantidade (máx. ${quantityMax})`}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value > quantityMax) {
                                            alert(`Quantidade máxima é ${quantityMax}`);
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
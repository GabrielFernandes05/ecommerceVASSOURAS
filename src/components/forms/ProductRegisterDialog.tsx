"use client";
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

interface ProductRegisterDialogProps {
    categories: { id: number; name: string }[];
    setCategories: (cats: { id: number; name: string }[]) => void;
    categoryIds: number[];
    setCategoryIds: (ids: number[]) => void;
    onProductCreated: (id: number) => void;
    categoryService: any;
    productService: any;
}

const ProductRegisterDialog = ({
    categories,
    setCategories,
    categoryIds,
    setCategoryIds,
    onProductCreated,
    categoryService,
    productService,
}: ProductRegisterDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState("https://plumberswholesale.com/media/catalog/product/placeholder/default/NoImage_256_6.png");
    const isActive = true;

    useEffect(() => {
        if (open) {
            categoryService.getCategories()
                .then((response: any) => setCategories(response.data))
                .catch(() => setCategories([]));
        }
    }, [open, categoryService, setCategories]);

    const handleSave = () => {
        if (!name || !description || price <= 0 || stock < 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }
        productService.createProduct(
            name,
            description,
            price,
            stock,
            imageUrl,
            isActive,
            categoryIds
        ).then((response: any) => {
            setOpen(false);
            onProductCreated(response.data.id);
        }).catch((error: any) => {
            alert("Erro ao criar produto.");
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-gray-200 text-black hover:bg-white hover:shadow-black hover:shadow-md">
                    Vender Produto <PlusCircle className="ml-2" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Cadastrar Produto</AlertDialogTitle>
                    <div>
                        <Card>
                            <CardHeader>Digite as informações do seu produto</CardHeader>
                            <CardContent className="grid gap-4">
                                <Input placeholder="Nome do Produto" onChange={e => setName(e.target.value)} />
                                <Input placeholder="Descrição do Produto" onChange={e => setDescription(e.target.value)} />
                                <Input placeholder="Preço do Produto" onChange={e => setPrice(Number(e.target.value))} type="number" min={0} />
                                <Input placeholder="Quantidade em Estoque" onChange={e => setStock(Number(e.target.value))} type="number" min={1} />
                                <Input placeholder="URL da Imagem" onChange={e => setImageUrl(e.target.value)} />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {categoryIds.length > 0
                                                ? categories.filter(cat => categoryIds.includes(cat.id)).map(cat => cat.name).join(", ")
                                                : "Selecione as categorias"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-72">
                                        {categories.map(cat => (
                                            <DropdownMenuCheckboxItem
                                                key={cat.id}
                                                checked={categoryIds.includes(cat.id)}
                                                onCheckedChange={checked => {
                                                    if (checked) {
                                                        setCategoryIds([...categoryIds, cat.id]);
                                                    } else {
                                                        setCategoryIds(categoryIds.filter((id: number) => id !== cat.id));
                                                    }
                                                }}
                                            >
                                                {cat.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleSave}>Salvar</AlertDialogAction>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ProductRegisterDialog;

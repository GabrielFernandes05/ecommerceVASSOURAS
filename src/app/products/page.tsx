"use client";
import { SidebarProvider, SidebarHeader, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react"
import Header from "@/components/ui/header"
import { useEffect, useState } from "react";
import { ProductService, CategoryService } from "@/services/axiosService";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export default function Home() {

  const formCadastrarProduto = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const isActive = true;
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const productService = new ProductService();
    const categoryService = new CategoryService();

    useEffect(() => {
      categoryService.getCategories()
        .then(response => setCategories(response.data))
        .catch(error => setCategories([]));
    }, []);

    const handleSave = () => {
      if (!name || !description || price <= 0 || stock < 0 || !imageUrl) {
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
      ).then(response => {
        console.log("Produto criado com sucesso:", response.data);
      }).catch(error => {
        console.error("Erro ao criar produto:", error);
      });
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-gray-200 text-black hover:bg-white hover:shadow-black hover:shadow-md">
            Cadastrar Produto <PlusCircle className="ml-2" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Cadastrar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              <Card>
                <CardHeader>Digite as informações do seu produto</CardHeader>
                <CardContent className="grid gap-4">

                  <Input placeholder="Nome do Produto" onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Descrição do Produto" onChange={(e) => setDescription(e.target.value)} />
                  <Input placeholder="Preço do Produto" onChange={(e) => setPrice(Number(e.target.value))} type="number" min={0} />
                  <Input placeholder="Quantidade em Estoque" onChange={(e) => setStock(Number(e.target.value))} type="number" min={1} />
                  <Input placeholder="URL da Imagem" onChange={(e) => setImageUrl(e.target.value)} />
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
                          onCheckedChange={(checked) => {
                            setCategoryIds((prev) =>
                              checked
                                ? [...prev, cat.id]
                                : prev.filter(id => id !== cat.id)
                            );
                          }}
                        >
                          {cat.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                </CardContent>
              </Card>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSave}>
              Salvar
            </AlertDialogAction>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <div className="p-4 bg-gray-50 min-h-screen w-full flex flex-col">
        <div className="flex justify-between mb-4 p-4">
          <h1 className="text-4xl font-bold text-black">Produtos</h1>
          {formCadastrarProduto()}
        </div>
        <div className="flex gap-4 p-4 bg-gray-100 border rounded-md">
          <div className="bg-gray-200 h-full rounded-md p-4">
            <SidebarProvider className="flex flex-col">
              <SidebarHeader>
                <h2 className="text-lg font-bold">Categorias</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Todos os Produtos</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Eletrônicos</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Roupas</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Calçados</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </SidebarProvider>
          </div>
          <div className="bg-gray-200 w-full h-full rounded-md p-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Produtos em Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8">
                  <p>Produto 1</p>
                  <p>Produto 2</p>
                  <p>Produto 3</p>
                  <p>Produto 4</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )

}
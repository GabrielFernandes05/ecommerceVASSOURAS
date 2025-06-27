"use client";
import { SidebarProvider, SidebarHeader, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductService, CategoryService } from "@/services/axiosService";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import Header from "@/components/ui/header";
import { useRouter } from "next/navigation";
import { ListCollapse } from "lucide-react";
import CartForm from "@/components/forms/cartForm";
import ProductRegisterDialog from "@/components/forms/ProductRegisterDialog";

export default function Home() {
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    productService.getProducts()
      .then(response => {
        setProducts(response.data.items);
      })
      .catch(error => setProducts([]));
    categoryService.getCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => setCategories([]));
  }, []);

  return (
    <>
      <Header />
      <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen w-full flex flex-col">
        <div className="flex justify-between mb-4 p-4">
          <h1 className="text-2xl font-bold text-black">Produtos</h1>
          {username ? (
            <ProductRegisterDialog
              categories={categories}
              setCategories={setCategories}
              categoryIds={categoryIds}
              setCategoryIds={setCategoryIds}
              onProductCreated={id => router.push(`/products/${id}`)}
              categoryService={categoryService}
              productService={productService}
            />
          ) : null}
        </div>
        <div className="flex gap-4 p-4 bg-gray-100 border rounded-md">
          <div className="bg-gray-200 rounded-md p-4">
            <SidebarProvider className="flex flex-col">
              <SidebarHeader>
                <h2 className="text-lg font-bold">Categorias</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {categories.map((category: any) => (
                      <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton>
                          <span>{category.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </SidebarProvider>
          </div>
          <div className="bg-gray-200 w-full h-full rounded-md p-4 border-red-800">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Em destaque</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-6">
                {products.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center border rounded-lg bg-white shadow-md p-4 min-w-56 min-h-72"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      title={product.name}
                      className="w-32 h-32 object-cover rounded-md mb-2"
                      loading="lazy"
                    />
                    <h3 className="font-bold text-center truncate w-full">{product.name}</h3>
                    <p className="text-sm text-gray-600 text-center line-clamp-3">{product.description}</p>
                    <p className="text-lg font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Estoque: {product.stock}</p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        className="mt-2 bg-red-800 text-white hover:bg-red-700"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <ListCollapse />
                      </Button>
                      {username ? <CartForm productId={product.id} quantityMax={product.stock} /> : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
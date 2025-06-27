"use client";
import { SidebarProvider, SidebarHeader, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { ProductService, CategoryService } from "@/services/axiosService";
import Header from "@/components/ui/header";
import { useRouter } from "next/navigation";
import { ListCollapse, Filter, BarChart3, Package, AlertCircle } from "lucide-react";
import CartForm from "@/components/forms/cartForm";
import ProductRegisterDialog from "@/components/forms/ProductRegisterDialog";
import ProductManager from "@/components/forms/ProductManager";
import { useCart } from "@/hooks/useCart";

export default function ProductsPage() {
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const router = useRouter();
  const { getProductQuantityInCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar produtos do usuário - incluindo inativos se necessário
      const productsResponse = await productService.getProducts(0, 100, undefined, undefined, true);
      const userProducts = productsResponse.data.items.filter((product: any) =>
        product.created_by_id.toString() === localStorage.getItem("user_id")
      );
      setProducts(userProducts);
      applyFilters(userProducts, selectedCategory, showInactive);

      // Carregar categorias
      const categoriesResponse = await categoryService.getCategories();
      setCategories(categoriesResponse.data);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
      setCategories([]);
    }
  };

  const refreshProducts = () => {
    loadData();
  };

  const applyFilters = (productsToFilter = products, categoryId = selectedCategory, includeInactive = showInactive) => {
    let filtered = productsToFilter;

    // Filtrar por status ativo/inativo
    if (!includeInactive) {
      filtered = filtered.filter(product => product.is_active);
    }

    // Filtrar por categoria
    if (categoryId !== null) {
      filtered = filtered.filter(product =>
        product.categories && product.categories.some((cat: any) => cat.id === categoryId)
      );
    }

    setFilteredProducts(filtered);
  };

  const filterByCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    applyFilters(products, categoryId, showInactive);
  };

  const toggleShowInactive = () => {
    const newShowInactive = !showInactive;
    setShowInactive(newShowInactive);
    applyFilters(products, selectedCategory, newShowInactive);
  };

  const getProductStats = () => {
    const activeProducts = products.filter(p => p.is_active).length;
    const inactiveProducts = products.filter(p => !p.is_active).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;

    return { activeProducts, inactiveProducts, outOfStock, total: products.length };
  };

  const stats = getProductStats();

  return (
    <>
      <Header />
      <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen w-full flex flex-col">
        <div className="flex justify-between mb-6 p-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Meus Produtos</h1>
            <p className="text-gray-600">Gerencie seu inventário e vendas</p>

            {/* Estatísticas em cards compactos */}
            <div className="flex gap-4 mt-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Ativos</span>
                </div>
                <p className="text-lg font-bold text-green-600">{stats.activeProducts}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Inativos</span>
                </div>
                <p className="text-lg font-bold text-orange-600">{stats.inactiveProducts}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Sem Estoque</span>
                </div>
                <p className="text-lg font-bold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
          <ProductRegisterDialog
            categories={categories}
            setCategories={setCategories}
            categoryIds={categoryIds}
            setCategoryIds={setCategoryIds}
            onProductCreated={(id) => {
              router.push(`/products/${id}`);
              refreshProducts();
            }}
            categoryService={categoryService}
            productService={productService}
          />
        </div>

        <div className="flex gap-4 p-4 bg-gray-100 border rounded-md">
          <div className="bg-gray-200 rounded-md p-4 min-w-64">
            <SidebarProvider className="flex flex-col">
              <SidebarHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-bold">Filtros</h2>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {/* Toggle para mostrar produtos inativos */}
                    <SidebarMenuItem>
                      <div className="p-3 bg-white rounded-md mb-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={toggleShowInactive}
                            className="rounded w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm font-medium">Incluir produtos inativos</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Produtos retirados da loja temporariamente
                        </p>
                      </div>
                    </SidebarMenuItem>

                    {/* Filtros por categoria */}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => filterByCategory(null)}
                        className={`cursor-pointer mb-1 ${selectedCategory === null ? 'bg-red-800 text-white' : 'hover:bg-gray-300'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>📋 Todos os Produtos</span>
                          <Badge variant="outline" className="text-xs">
                            {products.length}
                          </Badge>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {categories.map((category: any) => {
                      const categoryProductCount = products.filter(product =>
                        product.categories && product.categories.some((cat: any) => cat.id === category.id) &&
                        (showInactive || product.is_active)
                      ).length;

                      return (
                        <SidebarMenuItem key={category.id}>
                          <SidebarMenuButton
                            onClick={() => filterByCategory(category.id)}
                            className={`cursor-pointer mb-1 ${selectedCategory === category.id ? 'bg-red-800 text-white' : 'hover:bg-gray-300'}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>📂 {category.name}</span>
                              <Badge
                                variant={categoryProductCount > 0 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {categoryProductCount}
                              </Badge>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </SidebarProvider>
          </div>

          <div className="bg-gray-200 w-full h-full rounded-md p-4 border-red-800">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {selectedCategory === null
                    ? "Meus produtos anunciados"
                    : `Meus produtos - ${categories.find(cat => cat.id === selectedCategory)?.name || 'Categoria'}`
                  }
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProducts.length} produto(s) encontrado(s)
                  {selectedCategory !== null && ` na categoria selecionada`}
                  {!showInactive && " (apenas ativos)"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-500">
                      {selectedCategory === null
                        ? (showInactive ? "Você ainda não cadastrou nenhum produto." : "Você não possui produtos ativos.")
                        : (showInactive ? "Você não possui produtos nesta categoria." : "Você não possui produtos ativos nesta categoria.")
                      }
                    </p>
                    {selectedCategory !== null && (
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => filterByCategory(null)}
                      >
                        Ver todos os produtos
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredProducts.map((product: any) => {
                    const currentCartQuantity = getProductQuantityInCart(product.id);
                    const availableStock = product.stock;
                    const isSoldOut = availableStock <= 0;
                    const isInactive = !product.is_active;

                    return (
                      <div
                        key={product.id}
                        className={`flex flex-col border rounded-lg shadow-md p-4 min-w-64 transition-all hover:shadow-lg ${isInactive ? 'bg-gray-50 border-gray-300' :
                          isSoldOut ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="relative mb-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            title={product.name}
                            className={`w-full h-40 object-cover rounded-md ${(isSoldOut || isInactive) ? 'grayscale opacity-75' : ''
                              }`}
                            loading="lazy"
                          />
                          {/* Status overlay */}
                          {isInactive && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">INATIVO</Badge>
                            </div>
                          )}
                          {!isInactive && isSoldOut && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive">ESGOTADO</Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-green-600">
                                R$ {product.price.toFixed(2)}
                              </span>
                              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                {product.stock} un.
                              </Badge>
                            </div>
                          </div>

                          {/* Categorias do produto */}
                          {product.categories && product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.categories.map((cat: any) => (
                                <Badge key={cat.id} variant="outline" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Ações do produto */}
                          <div className="space-y-3">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/products/${product.id}`)}
                                className="flex-1"
                              >
                                <ListCollapse className="h-4 w-4 mr-1" />
                                Detalhes
                              </Button>

                              {!isSoldOut && product.is_active && (
                                <CartForm
                                  productId={product.id}
                                  quantityMax={product.stock}
                                  currentCartQuantity={currentCartQuantity}
                                />
                              )}
                            </div>

                            {/* Gerenciamento do produto */}
                            <ProductManager
                              product={product}
                              onProductUpdated={refreshProducts}
                              productService={productService}
                            />
                          </div>
                        </div>

                        {/* Status info */}
                        {(isSoldOut || isInactive) && (
                          <div className="mt-3 p-2 bg-gray-100 rounded-md text-center">
                            <p className="text-xs text-gray-600">
                              {isInactive
                                ? "🔒 Produto retirado da loja temporariamente"
                                : "📦 Produto sem estoque - não aparece para compradores"
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
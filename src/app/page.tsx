"use client";
import { SidebarProvider, SidebarHeader, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { ProductService, CategoryService } from "@/services/axiosService";
import Header from "@/components/ui/header";
import { useRouter } from "next/navigation";
import { ListCollapse, Filter, ShoppingCart, Search } from "lucide-react";
import CartForm from "@/components/forms/cartForm";
import ProductRegisterDialog from "@/components/forms/ProductRegisterDialog";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const { cart, getProductQuantityInCart } = useCart();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    productService.getProducts()
      .then(response => {
        const loadedProducts = response.data.items || [];
        setProducts(loadedProducts);
        // Aplicar filtros com os produtos carregados
        applyFilters(selectedCategory, searchTerm, loadedProducts);
      })
      .catch(error => {
        console.error("Erro ao carregar produtos:", error);
        setProducts([]);
        setFilteredProducts([]);
      });
  };

  const loadCategories = () => {
    categoryService.getCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => setCategories([]));
  };

  const filterByCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    applyFilters(categoryId, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(selectedCategory, term);
  };

  const applyFilters = (categoryId: number | null = selectedCategory, search: string = searchTerm, productsToFilter: any[] = products) => {
    let filtered = [...productsToFilter]; // Criar uma cópia para evitar mutação

    // Sempre filtrar produtos inativos na página principal primeiro
    filtered = filtered.filter(product => product.is_active);

    // Filtrar por categoria
    if (categoryId !== null) {
      filtered = filtered.filter(product =>
        product.categories && product.categories.some((cat: any) => cat.id === categoryId)
      );
    }

    // Filtrar por busca
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <Header />
      <div className="mx-auto pt-36 p-4 bg-gray-50 min-h-screen w-full flex flex-col">
        <div className="flex justify-between mb-6 p-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Loja de Vassouras</h1>
            <p className="text-gray-600">Encontre os melhores produtos</p>
          </div>
          {username ? (
            <ProductRegisterDialog
              categories={categories}
              setCategories={setCategories}
              categoryIds={categoryIds}
              setCategoryIds={setCategoryIds}
              onProductCreated={id => {
                router.push(`/products/${id}`);
                loadProducts();
              }}
              categoryService={categoryService}
              productService={productService}
            />
          ) : null}
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
                    {/* Barra de pesquisa */}
                    <SidebarMenuItem>
                      <div className="p-3 bg-white rounded-md mb-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 pr-3"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Pesquise por nome ou descrição
                        </p>
                      </div>
                    </SidebarMenuItem>

                    {/* Opção para mostrar todos os produtos */}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => filterByCategory(null)}
                        className={`cursor-pointer mb-1 ${selectedCategory === null ? 'bg-red-800 text-white' : 'hover:bg-gray-300'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>🛍️ Todos os Produtos</span>
                          <Badge variant="outline" className="text-xs">
                            {products.length}
                          </Badge>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {categories.map((category: any) => {
                      const categoryProductCount = products.filter(product =>
                        product.categories && product.categories.some((cat: any) => cat.id === category.id)
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
                  {searchTerm ? (
                    `Resultados para "${searchTerm}"`
                  ) : selectedCategory === null ? (
                    "Em destaque"
                  ) : (
                    `Categoria: ${categories.find(cat => cat.id === selectedCategory)?.name || 'Desconhecida'}`
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProducts.length} produto(s) encontrado(s)
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedCategory !== null && !searchTerm && ` na categoria selecionada`}
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm ? (
                        `Nenhum produto encontrado para "${searchTerm}".`
                      ) : selectedCategory === null ? (
                        "Nenhum produto disponível."
                      ) : (
                        "Nenhum produto encontrado nesta categoria."
                      )}
                    </p>
                    {(searchTerm || selectedCategory !== null) && (
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                          applyFilters(null, "");
                        }}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredProducts.map((product: any) => {
                    const currentCartQuantity = getProductQuantityInCart(product.id);
                    const availableStock = product.stock;
                    const isSoldOut = availableStock <= 0;
                    const isInactive = !product.is_active;

                    // Na página principal, não mostrar produtos inativos
                    if (isInactive) return null;

                    return (
                      <div
                        key={product.id}
                        className={`flex flex-col border rounded-lg shadow-md p-4 min-w-64 transition-all hover:shadow-lg ${isSoldOut ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="relative mb-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            title={product.name}
                            className={`w-full h-40 object-cover rounded-md ${isSoldOut ? 'grayscale opacity-75' : ''
                              }`}
                            loading="lazy"
                          />
                          {isSoldOut && (
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

                          {/* Mostrar categorias do produto */}
                          {product.categories && product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.categories.map((cat: any) => (
                                <Badge key={cat.id} variant="outline" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Info adicional para compradores */}
                          <div className="text-sm text-center mb-3">
                            {isSoldOut ? (
                              <p className="text-red-600 font-semibold flex items-center justify-center gap-1">
                                📦 Produto Esgotado
                              </p>
                            ) : (
                              <>
                                <p className="text-gray-500 flex items-center justify-center gap-1">
                                  📦 {availableStock} disponível{availableStock > 1 ? 's' : ''}
                                </p>
                                {currentCartQuantity > 0 && (
                                  <p className="text-amber-600 text-xs flex items-center justify-center gap-1 mt-1">
                                    <ShoppingCart className="h-3 w-3" />
                                    {currentCartQuantity} no carrinho
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/products/${product.id}`)}
                              className="flex-1"
                            >
                              <ListCollapse className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                            {username && !isSoldOut ? (
                              <CartForm
                                productId={product.id}
                                quantityMax={product.stock}
                                currentCartQuantity={currentCartQuantity}
                              />
                            ) : null}
                          </div>
                        </div>

                        {isSoldOut && (
                          <div className="mt-3 p-2 bg-orange-100 rounded-md text-center">
                            <p className="text-xs text-orange-700">
                              📦 Este produto está temporariamente indisponível
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }).filter(Boolean) // Remove null values (produtos inativos)
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
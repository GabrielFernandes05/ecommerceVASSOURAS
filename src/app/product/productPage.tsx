'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Types baseados no modelo SQLAlchemy
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories: Category[];
}

interface CartItem {
  product_id: number;
  quantity: number;
}

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  // Mock de imagens adicionais (na prática viriam da API)
  const [additionalImages] = useState<string[]>([
    '/api/placeholder/600/400',
    '/api/placeholder/600/401',
    '/api/placeholder/600/402',
    '/api/placeholder/600/403'
  ]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API
      // const response = await fetch(`/api/products/${productId}`);
      // const data = await response.json();
      
      // Mock data baseado no modelo
      const mockProduct: Product = {
        id: parseInt(productId),
        name: "Smartphone Premium XYZ",
        description: "Um smartphone de última geração com câmera de 108MP, processador octa-core, 256GB de armazenamento e tela AMOLED de 6.7 polegadas. Perfeito para quem busca performance e qualidade em fotos.",
        price: 2499.99,
        stock: 15,
        image_url: '/api/placeholder/600/400',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: [
          { id: 1, name: "Eletrônicos" },
          { id: 2, name: "Smartphones" },
          { id: 3, name: "Premium" }
        ]
      };
      
      setProduct(mockProduct);
      setSelectedImage(mockProduct.image_url);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setCartLoading(true);
      
      const cartItem: CartItem = {
        product_id: product.id,
        quantity: quantity
      };
      
      // await fetch('/api/cart', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cartItem)
      // });
      
      alert(`${quantity} item(s) adicionado(s) ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar item ao carrinho');
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?product_id=${product.id}&quantity=${quantity}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Início
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-700">
                  Produtos
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 truncate">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setShowImageGallery(true)}
                />
                <button
                  onClick={() => setShowImageGallery(true)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-sm font-medium">Ver mais</span>
                </button>
              </div>

              {/* Miniaturas */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    selectedImage === product.image_url ? 'border-blue-600' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(product.image_url)}
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                {additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                      selectedImage === image ? 'border-blue-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 2}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Categorias */}
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Título e Preço */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-500">à vista</span>
                </div>
              </div>

              {/* Status do Estoque */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                </span>
              </div>

              {/* Descrição */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Seletor de Quantidade */}
              {product.stock > 0 && (
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">máx. {product.stock}</span>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="space-y-3">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20"
                    >
                      Comprar Agora
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {cartLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6.5" />
                          </svg>
                          Adicionar ao Carrinho
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg cursor-not-allowed"
                  >
                    Produto Indisponível
                  </button>
                )}
              </div>

              {/* Informações Adicionais */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Produto cadastrado em:</span>
                  <span className="text-gray-900">{formatDate(product.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última atualização:</span>
                  <span className="text-gray-900">{formatDate(product.updated_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID do produto:</span>
                  <span className="text-gray-900">#{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal da Galeria de Imagens */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300 z-10"
            >
              ✕ Fechar
            </button>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex gap-3 mt-4 overflow-x-auto">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImage === product.image_url ? 'border-white' : 'border-gray-600'
                }`}
                onClick={() => setSelectedImage(product.image_url)}
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              {additionalImages.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === image ? 'border-white' : 'border-gray-600'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Imagem ${index + 2}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
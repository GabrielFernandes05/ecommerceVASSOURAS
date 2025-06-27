import { useState, useEffect } from 'react';
import { CartService } from '@/services/axiosService';

const cartService = new CartService();

export const useCart = () => {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await cartService.getCart();
            setCart(response.data);
        } catch (error) {
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const getProductQuantityInCart = (productId: number): number => {
        if (!cart || !cart.items) return 0;
        const item = cart.items.find((item: any) => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    const getAvailableQuantity = (productId: number, totalStock: number): number => {
        const currentQuantity = getProductQuantityInCart(productId);
        return Math.max(0, totalStock - currentQuantity);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return {
        cart,
        loading,
        fetchCart,
        getProductQuantityInCart,
        getAvailableQuantity,
    };
};

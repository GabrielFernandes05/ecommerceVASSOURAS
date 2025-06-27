import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export class AuthService {
    authenticate(email: string, password: string) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        return axiosInstance.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }
}


export class UserService {
    register(name: string, address: string, email: string, password: string) {
        return axiosInstance.post('/users/register', {
            name,
            address,
            email,
            is_superuser: false,
            is_active: true,
            password
        });
    }

    getUser() {
        return axiosInstance.get('/users/me');
    }
}

export class ProductService {
    createProduct(
        name: string,
        description: string,
        price: number,
        stock: number,
        image_url: string,
        is_active: boolean,
        category_ids: number[]
    ) {
        return axiosInstance.post('/products/productpostbyuser/', {
            name,
            description,
            price,
            stock,
            image_url,
            is_active,
            category_ids
        });
    }

    getProducts(
        skip: number = 0,
        limit: number = 20,
        category?: number,
        search?: string
    ) {
        const params: any = { skip, limit };
        if (category !== undefined && category !== null) params.category = category;
        if (search) params.search = search;
        return axiosInstance.get('/products/', { params });
    }

    getProduct(id: number) {
        return axiosInstance.get(`/products/${id}`);
    }

    updateProduct(id: number, data: {
        name?: string,
        description?: string,
        price?: number,
        stock?: number,
        image_url?: string,
        is_active?: boolean,
        category_ids?: number[]
    }) {
        return axiosInstance.put(`/products/my/${id}`, data);
    }

    deleteProduct(id: number) {
        return axiosInstance.delete(`/products/my/${id}`);
    }
}

export class CategoryService {
    getCategories() {
        return axiosInstance.get('/categories/');
    }
}

export class CartService {
    getCart() {
        return axiosInstance.get('/cart/');
    }

    clearCart() {
        return axiosInstance.delete('/cart/');
    }

    addItemToCart(productId: number, quantity: number) {
        return axiosInstance.post('/cart/items', {
            product_id: productId,
            quantity: quantity
        });
    }

    updateCartItem(productId: number, quantity: number) {
        return axiosInstance.put(`/cart/items/${productId}/`, {
            quantity: quantity
        });
    }

    removeItemFromCart(productId: number) {
        return axiosInstance.delete(`/cart/items/${productId}/`);
    }

    // Método para obter quantidade de um produto específico no carrinho
    async getProductQuantityInCart(productId: number): Promise<number> {
        try {
            const response = await this.getCart();
            const cart = response.data;
            if (cart && cart.items) {
                const item = cart.items.find((item: any) => item.product.id === productId);
                return item ? item.quantity : 0;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }
}

export class OrderService {
    createOrder(shippingAddress: string, paymentMethod: string) {
        return axiosInstance.post('/orders/', {
            shipping_address: shippingAddress,
            payment_method: paymentMethod
        });
    }

    getOrders(skip: number = 0, limit: number = 10) {
        const params = { skip, limit };
        return axiosInstance.get('/orders/', { params });
    }

    getOrder(orderId: number) {
        return axiosInstance.get(`/orders/${orderId}`);
    }

    updateOrderStatus(orderId: number, status: string) {
        return axiosInstance.put(`/orders/${orderId}/status`, { status });
    }
}
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
}

export class CategoryService {
    getCategories() {
        return axiosInstance.get('/categories/');
    }
}
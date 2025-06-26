import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
});

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
"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { AuthService, UserService } from "@/services/axiosService";
import { useRouter } from "next/navigation";

export default function Home() {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const authService = new AuthService();
    const userService = new UserService();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email && password) {
            try {
                authService.authenticate(email, password).then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem("access_token", response.data.access_token);
                        userService.getUser().then((userResponse) => {
                            localStorage.setItem("username", JSON.stringify(userResponse.data.name));
                            localStorage.setItem("user_id", JSON.stringify(userResponse.data.id));
                        }).catch((error) => {
                            console.error(`Erro ao obter usuário: ${error.response?.data.detail}`);
                        });
                        router.push("/");
                    }
                })
                    .catch((error) => {
                        if (error.response) {
                            alert(`Erro ao realizar login: ${error.response.data.detail}`);
                        }
                    });
            } catch (e: any) {
                alert(`Erro ao fazer login: ${e.response?.data}`);
            }
        } else {
            alert("Preencha o e-mail e a senha!");
        }
    };

    return (
        <section className="flex items-center justify-center h-screen">
            <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-4">
                <h1 className="py-2 text-3xl font-bold">Faça seu Login</h1>

                <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-red-800 w-full cursor-pointer rounded-full border border-gray-400 px-4 py-4 font-bold text-white"
                    >
                        Login
                    </button>
                </form>

                <p>
                    Ainda não tem uma conta?{" "}
                    <Link href="/register" className="font-semibold underline">
                        Registre-se Aqui!
                    </Link>
                </p>
            </div>
        </section>
    );
}

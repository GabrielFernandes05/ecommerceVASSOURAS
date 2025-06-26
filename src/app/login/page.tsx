"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface LoginProps {
    user: any;
    setUser: (user: any) => void;
}

export default function Login({ user, setUser }: LoginProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email && password) {
            try {
                const { data: userDoc } = await axios.post("/users/login", {
                    email,
                    password,
                });

                setUser(userDoc);
                setRedirect(true);
            } catch (error: any) {
                alert(`Erro ao fazer login: ${error?.response?.data || "Erro desconhecido"}`);
            }
        } else {
            alert("Preencha o e-mail e a senha!");
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    if (redirect || user) {
        return <Link href="/">Redirecionando...</Link>;
    }

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
                        onChange={handleEmailChange}
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={password}
                        onChange={handlePasswordChange}
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

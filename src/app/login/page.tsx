"use client";

import React, { useState } from "react";
import Link from "next/link";

import axios from "axios";


export default function Home({ user, setUser }: { user: any; setUser: any }) {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [redirect, setRedirect] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email && password) {
            try {
                const { data: userDoc } = await axios.post("/users/login", {
                    email,
                    password,
                });

                setUser(userDoc);
                setRedirect(true);
            } catch (e: any) {
                alert(`Erro ao fazer login: ${e.response.data}`);
            }
        } else {
            alert("Preencha o e-mail e a senha!");
        }
    };

    if (redirect || user) {
        return <Link href="/">Redirecionando...</Link>;
    }

    return (
        <section className="flex items-center align-center justify-center h-screen">
            <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-4">
                <h1 className="py-2 text-3xl font-bold">Faça seu Login</h1>

                <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={email}
                        onChange={(e: any) => {
                            setEmail(e.target.value);
                        }}
                    ></input>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={password}
                        onChange={(e: any) => {
                            setPassword(e.target.value);
                        }}
                    ></input>
                    <button className="bg-red-800 w-full cursor-pointer rounded-full border border-gray-400 px-4 py-4 font-bold text-white">
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
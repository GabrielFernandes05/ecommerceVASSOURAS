"use client";
import { UserService } from "@/services/axiosService";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
    const userService = new UserService();
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (name && address && email && password) {
            try {
                userService.register(name, address, email, password).then((response) => {
                    if (response.status === 200) {
                        alert("Cadastro realizado com sucesso!");
                        router.push("/");
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        alert(`Erro ao realizar cadastro: ${error.response.data.detail}`);
                    }
                });
            } catch (error) {
                alert("Erro ao realizar cadastro.");
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    }

    return (
        <section className="flex items-center align-center justify-center h-screen">
            <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-4">
                <h1 className="py-2 text-3xl font-bold">Faça seu Cadastro</h1>

                <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Digite seu nome"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Digite seu endereço"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-full bg-red-800 px-4 py-4 text-white hover:bg-red-800 transition-colors duration-300"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </section>
    );
}
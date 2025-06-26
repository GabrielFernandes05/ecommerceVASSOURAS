"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { ShoppingCart, CircleUser, Menu } from "lucide-react";


const Header = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    return (
        <header className="shadow-xl fixed top-0 left-0 w-full z-10">
            <div className="max-w-7x1 mx-auto flex items-center justify-between sm:px-8 py-8 bg-red-800">
                <Link href="/" className="flex items-center">
                    <p className="text-white text-4xl font-bold">
                        BarãoUsada
                    </p>
                </Link>


                <div className="flex items-center gap-3 rounded-full border border-white py-2 pr-4 pl-6 shadow-md">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Menu size={34} color="#ffffff" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={username ? "/account" : "/login"}>
                                    {username ? "Minha Conta" : "Login"}
                                </Link>
                            </DropdownMenuItem>
                            {username ? (
                                <>
                                    <DropdownMenuItem>
                                        <Link href="/products">Meus Produtos</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/orders">Meus Pedidos</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/logout">Sair</Link>
                                    </DropdownMenuItem>
                                </>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CircleUser size={34} color="#ffffff" />
                    {username ? (
                        <p className="truncate max-w-20 sm:max-w-32 text-white">{username}</p>
                    ) : null}
                    <a href="/cart">
                        <ShoppingCart size={34} color="#ffffff" />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
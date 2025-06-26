"use client";
import React from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { ShoppingCart, CircleUser, Menu } from "lucide-react";


const Header = ({ user }: { user: any }) => {
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
                            <Menu size={34} color="#ffffff"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={user ? "/account" : "/login"}>{user ? "Minha Conta" : "Login"}</Link>
                            </DropdownMenuItem>
                            {user ? (
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

                    <CircleUser size={34} color="#ffffff"/>
                    {user ? (
                        <p className="trun max-w-20 sm:max-w-32">{user.name}</p>
                    ) : (
                        <></>
                    )}

                    <ShoppingCart size={34} color="#ffffff"/>
                </div>
            </div>
        </header>
    );
};

export default Header;
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        router.push("/");
    }, [router]);

    return null;
}
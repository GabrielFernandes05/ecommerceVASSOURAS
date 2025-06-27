"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    duration?: number;
    onClose: () => void;
}

export const Toast = ({ message, type, duration = 5000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Aguarda a animação terminar
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
        >
            <div
                className={`rounded-lg p-4 shadow-lg flex items-center space-x-3 max-w-md ${type === "success"
                        ? "bg-green-50 border-l-4 border-green-400"
                        : "bg-red-50 border-l-4 border-red-400"
                    }`}
            >
                {type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <div className="flex-1">
                    <p
                        className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"
                            }`}
                    >
                        {message}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${type === "success"
                            ? "text-green-400 hover:bg-green-400"
                            : "text-red-400 hover:bg-red-400"
                        }`}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

interface ToastContextType {
    showToast: (message: string, type: "success" | "error") => void;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<
        Array<{ id: number; message: string; type: "success" | "error" }>
    >([]);

    const showToast = (message: string, type: "success" | "error") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};

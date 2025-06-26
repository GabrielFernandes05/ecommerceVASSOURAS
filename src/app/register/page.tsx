export default function Home() {
    return (
        <section className="flex items-center align-center justify-center h-screen">
            <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-4">
                <h1 className="py-2 text-3xl font-bold">Faça seu Cadastro</h1>

                <form className="flex w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Digite seu nome"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                    />
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className="w-full rounded-full border border-gray-400 px-4 py-4"
                    />
                    <button
                        type="submit"
                        className="w-full rounded-full bg-blue-500 px-4 py-4 text-white hover:bg-blue-600 transition-colors duration-300"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </section>
    );
}
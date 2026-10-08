"use client";

import { useEffect, useRef, useState } from "react";

type Mensagem = {
    pergunta: string;
    resposta: string;
};

type RespostaSalva = {
    pergunta: string;
    resposta: string;
};

export default function Home() {
    const [pergunta, setPergunta] = useState("");
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [curtidas, setCurtidas] = useState<number[]>([]);
    const [naoCurtidas, setNaoCurtidas] = useState<number[]>([]);
    const [menuAberto, setMenuAberto] = useState<number | null>(null);
    const [respostasSalvas, setRespostasSalvas] = useState<RespostaSalva[]>([]);
    const [mostrarSalvas, setMostrarSalvas] = useState(false);

    const campoPerguntaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const salvas = localStorage.getItem("minha-ia-respostas");

        if (salvas) {
            setRespostasSalvas(JSON.parse(salvas));
        }
    }, []);

    async function enviarPergunta() {
        if (!pergunta.trim() || carregando) {
            return;
        }

        const perguntaAtual = pergunta;

        setPergunta("");
        setCarregando(true);

        try {
            const resposta = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pergunta: perguntaAtual,
                }),
            });

            const dados = await resposta.json();

            setMensagens((anteriores) => [
                ...anteriores,
                {
                    pergunta: perguntaAtual,
                    resposta: dados.resposta,
                },
            ]);
        } catch (erro) {
            console.error(erro);

            setMensagens((anteriores) => [
                ...anteriores,
                {
                    pergunta: perguntaAtual,
                    resposta: "Ocorreu um erro ao obter a resposta.",
                },
            ]);
        } finally {
            setCarregando(false);
        }
    }

    function pressionarTecla(
        evento: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (evento.key === "Enter" && !evento.shiftKey) {
            evento.preventDefault();
            enviarPergunta();
        }
    }

    async function copiarResposta(resposta: string) {
        await navigator.clipboard.writeText(resposta);
    }

    function curtirResposta(indice: number) {
        setNaoCurtidas((anteriores) =>
            anteriores.filter((item) => item !== indice)
        );

        setCurtidas((anteriores) =>
            anteriores.includes(indice)
                ? anteriores.filter((item) => item !== indice)
                : [...anteriores, indice]
        );
    }

    function naoCurtirResposta(indice: number) {
        setCurtidas((anteriores) =>
            anteriores.filter((item) => item !== indice)
        );

        setNaoCurtidas((anteriores) =>
            anteriores.includes(indice)
                ? anteriores.filter((item) => item !== indice)
                : [...anteriores, indice]
        );
    }

    async function compartilharResposta(
        perguntaTexto: string,
        resposta: string
    ) {
        const texto = `Pergunta: ${perguntaTexto}\n\nResposta: ${resposta}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Minha IA",
                    text: texto,
                });
            } catch {
                console.log("Compartilhamento cancelado.");
            }
        } else {
            await navigator.clipboard.writeText(texto);
            alert("Resposta copiada para compartilhar.");
        }
    }

    function lerResposta(resposta: string) {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();

            const fala = new SpeechSynthesisUtterance(resposta);
            fala.lang = "pt-BR";

            window.speechSynthesis.speak(fala);
        }
    }

    function salvarResposta(
        perguntaTexto: string,
        resposta: string
    ) {
        const novaResposta: RespostaSalva = {
            pergunta: perguntaTexto,
            resposta,
        };

        const atualizadas = [...respostasSalvas, novaResposta];

        setRespostasSalvas(atualizadas);

        localStorage.setItem(
            "minha-ia-respostas",
            JSON.stringify(atualizadas)
        );
    }

    function excluirRespostaSalva(indice: number) {
        const atualizadas = respostasSalvas.filter(
            (_, index) => index !== indice
        );

        setRespostasSalvas(atualizadas);

        localStorage.setItem(
            "minha-ia-respostas",
            JSON.stringify(atualizadas)
        );
    }

    function continuarResposta(item: RespostaSalva) {
        setMostrarSalvas(false);

        setPergunta(
            `Continue a partir desta resposta:\n\n${item.resposta}`
        );

        setTimeout(() => {
            campoPerguntaRef.current?.focus();
        }, 0);
    }

    async function tentarNovamente(indice: number) {
        const mensagem = mensagens[indice];

        if (!mensagem || carregando) {
            return;
        }

        setCarregando(true);

        setMensagens((anteriores) =>
            anteriores.map((item, index) =>
                index === indice
                    ? {
                        ...item,
                        resposta: "",
                    }
                    : item
            )
        );

        setCurtidas((anteriores) =>
            anteriores.filter((item) => item !== indice)
        );

        setNaoCurtidas((anteriores) =>
            anteriores.filter((item) => item !== indice)
        );

        try {
            const resposta = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pergunta: mensagem.pergunta,
                }),
            });

            const dados = await resposta.json();

            setMensagens((anteriores) =>
                anteriores.map((item, index) =>
                    index === indice
                        ? {
                            ...item,
                            resposta: dados.resposta,
                        }
                        : item
                )
            );
        } catch (erro) {
            console.error(erro);

            setMensagens((anteriores) =>
                anteriores.map((item, index) =>
                    index === indice
                        ? {
                            ...item,
                            resposta: "Ocorreu um erro ao tentar novamente.",
                        }
                        : item
                )
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex h-screen max-w-4xl flex-col px-4 py-4">
                <header className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl">
                            ✦
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold">
                                Minha IA
                            </h1>

                            <p className="text-sm text-slate-500">
                                Sua assistente de conhecimento
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMostrarSalvas(true)}
                        className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        📚 Respostas salvas
                    </button>
                </header>

                {mostrarSalvas ? (
                    <section className="flex flex-1 flex-col overflow-hidden py-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Respostas salvas
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {respostasSalvas.length} resposta(s) salva(s)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMostrarSalvas(false)}
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                            >
                                ✕ Fechar
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                            {respostasSalvas.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-center text-slate-500">
                                    <div>
                                        <div className="mb-3 text-4xl">
                                            📚
                                        </div>

                                        <p>Nenhuma resposta salva ainda.</p>
                                    </div>
                                </div>
                            ) : (
                                respostasSalvas.map((item, indice) => (
                                    <div
                                        key={indice}
                                        className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                                    >
                                        <div className="mb-4">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-400">
                                                Pergunta
                                            </p>

                                            <p className="text-sm text-slate-200">
                                                {item.pergunta}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-400">
                                                Resposta
                                            </p>

                                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                                                {item.resposta}
                                            </p>
                                        </div>

                                        <div className="border-t border-slate-800 pt-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluirRespostaSalva(indice)
                                                }
                                                className="rounded-lg px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                            >
                                                🗑️ Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="flex flex-1 flex-col overflow-y-auto py-8">
                            {mensagens.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center">
                                    <div className="text-center">
                                        <div className="mb-4 text-5xl">
                                            ✦
                                        </div>

                                        <h2 className="text-3xl font-semibold">
                                            Olá!
                                        </h2>

                                        <p className="mt-2 text-slate-500">
                                            Como posso ajudar você hoje?
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {mensagens.map((mensagem, indice) => (
                                        <div
                                            key={indice}
                                            className="space-y-4"
                                        >
                                            <div className="flex justify-end">
                                                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 px-5 py-3 text-sm leading-6">
                                                    {mensagem.pergunta}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm">
                                                    ✦
                                                </div>

                                                <div className="min-w-0 max-w-[85%]">
                                                    <div className="rounded-2xl rounded-tl-md bg-slate-900 px-5 py-4">
                                                        {mensagem.resposta === "" &&
                                                            carregando ? (
                                                            <div className="flex items-center gap-1">
                                                                <span className="animate-bounce">
                                                                    •
                                                                </span>

                                                                <span className="animate-bounce [animation-delay:150ms]">
                                                                    •
                                                                </span>

                                                                <span className="animate-bounce [animation-delay:300ms]">
                                                                    •
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                                                                {mensagem.resposta}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {mensagem.resposta && (
                                                        <div className="mt-2 flex flex-wrap items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    copiarResposta(
                                                                        mensagem.resposta
                                                                    )
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                                                            >
                                                                📋 Copiar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    curtirResposta(indice)
                                                                }
                                                                className={`rounded-lg px-3 py-1.5 text-sm transition ${curtidas.includes(indice)
                                                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                                                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                                                    }`}
                                                            >
                                                                👍
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    naoCurtirResposta(indice)
                                                                }
                                                                className={`rounded-lg px-3 py-1.5 text-sm transition ${naoCurtidas.includes(indice)
                                                                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                                                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                                                    }`}
                                                            >
                                                                👎
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    tentarNovamente(indice)
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                                                            >
                                                                🔄 Tentar novamente
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    compartilharResposta(
                                                                        mensagem.pergunta,
                                                                        mensagem.resposta
                                                                    )
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                                                            >
                                                                ↗ Compartilhar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMenuAberto(
                                                                        menuAberto === indice
                                                                            ? null
                                                                            : indice
                                                                    )
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                                                            >
                                                                ⋯
                                                            </button>

                                                            {menuAberto === indice && (
                                                                <div className="relative">
                                                                    <div className="absolute bottom-10 left-0 z-10 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                lerResposta(
                                                                                    mensagem.resposta
                                                                                );
                                                                                setMenuAberto(null);
                                                                            }}
                                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                                                                        >
                                                                            🔊 Ler em voz alta
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                salvarResposta(
                                                                                    mensagem.pergunta,
                                                                                    mensagem.resposta
                                                                                );
                                                                                setMenuAberto(null);
                                                                            }}
                                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                                                                        >
                                                                            📌 Salvar resposta
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                continuarResposta({
                                                                                    pergunta:
                                                                                        mensagem.pergunta,
                                                                                    resposta:
                                                                                        mensagem.resposta,
                                                                                });

                                                                                setMenuAberto(null);
                                                                            }}
                                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                                                                        >
                                                                            📝 Continuar resposta
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {carregando && mensagens.length === 0 && (
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm">
                                        ✦
                                    </div>

                                    <div className="rounded-2xl bg-slate-900 px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="animate-bounce">
                                                •
                                            </span>

                                            <span className="animate-bounce [animation-delay:150ms]">
                                                •
                                            </span>

                                            <span className="animate-bounce [animation-delay:300ms]">
                                                •
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <footer className="border-t border-slate-800 pt-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-2">
                                <textarea
                                    ref={campoPerguntaRef}
                                    value={pergunta}
                                    onChange={(evento) =>
                                        setPergunta(evento.target.value)
                                    }
                                    onKeyDown={pressionarTecla}
                                    placeholder="Digite sua pergunta..."
                                    rows={1}
                                    className="max-h-32 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                                />

                                <button
                                    type="button"
                                    onClick={enviarPergunta}
                                    disabled={carregando}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ↑
                                </button>
                            </div>

                            <p className="mt-2 text-center text-xs text-slate-600">
                                Enter para enviar · Shift + Enter para nova linha
                            </p>
                        </footer>
                    </>
                )}
            </div>
        </main>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import SavedResponses from "@/components/SavedResponses";

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
  const [barraAberta, setBarraAberta] = useState(true);

  const campoPerguntaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const salvas = localStorage.getItem("minha-ia-respostas");

    if (salvas) {
      setRespostasSalvas(JSON.parse(salvas));
    }
  }, []);

  function novoChat() {
    setMensagens([]);
    setPergunta("");
    setCurtidas([]);
    setNaoCurtidas([]);
    setMenuAberto(null);
    setMostrarSalvas(false);

    setTimeout(() => {
      campoPerguntaRef.current?.focus();
    }, 0);
  }

  async function enviarPergunta() {
    if (!pergunta.trim() || carregando) {
      return;
    }

    const perguntaAtual = pergunta;
    const historicoAnterior = mensagens;
    const indiceNovaMensagem = mensagens.length;

    setPergunta("");
    setCarregando(true);
    setMenuAberto(null);

    setMensagens((anteriores) => [
      ...anteriores,
      {
        pergunta: perguntaAtual,
        resposta: "",
      },
    ]);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pergunta: perguntaAtual,
          historico: historicoAnterior,
        }),
      });

      if (!resposta.ok) {
        throw new Error(
          `Erro na requisição: ${resposta.status}`
        );
      }

      const dados = await resposta.json();

      setMensagens((anteriores) =>
        anteriores.map((item, indice) =>
          indice === indiceNovaMensagem
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
        anteriores.map((item, indice) =>
          indice === indiceNovaMensagem
            ? {
                ...item,
                resposta:
                  "Ocorreu um erro ao obter a resposta.",
              }
            : item
        )
      );
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

    const atualizadas = [
      ...respostasSalvas,
      novaResposta,
    ];

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

    const historicoAnterior = mensagens.slice(
      0,
      indice
    );

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
          historico: historicoAnterior,
        }),
      });

      if (!resposta.ok) {
        throw new Error(
          `Erro na requisição: ${resposta.status}`
        );
      }

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
                resposta:
                  "Ocorreu um erro ao tentar novamente.",
              }
            : item
        )
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-white">
      <div className="flex h-full">
        {barraAberta && (
          <Sidebar
            carregando={carregando}
            onNovoChat={novoChat}
            onFechar={() =>
              setBarraAberta(false)
            }
            onAbrirRespostasSalvas={() =>
              setMostrarSalvas(true)
            }
          />
        )}

        <div className="min-w-0 flex flex-1 flex-col">
          <ChatHeader
            barraAberta={barraAberta}
            onAbrirBarra={() =>
              setBarraAberta(true)
            }
            onAbrirRespostasSalvas={() =>
              setMostrarSalvas(true)
            }
          />

          <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4">
            {mostrarSalvas ? (
              <SavedResponses
                respostasSalvas={respostasSalvas}
                onFechar={() =>
                  setMostrarSalvas(false)
                }
                onExcluirResposta={
                  excluirRespostaSalva
                }
              />
            ) : (
              <>
                <ChatMessages
                  mensagens={mensagens}
                  carregando={carregando}
                  curtidas={curtidas}
                  naoCurtidas={naoCurtidas}
                  menuAberto={menuAberto}
                  onCopiarResposta={copiarResposta}
                  onCurtirResposta={curtirResposta}
                  onNaoCurtirResposta={
                    naoCurtirResposta
                  }
                  onTentarNovamente={
                    tentarNovamente
                  }
                  onCompartilharResposta={
                    compartilharResposta
                  }
                  onAlterarMenu={setMenuAberto}
                  onLerResposta={lerResposta}
                  onSalvarResposta={salvarResposta}
                  onContinuarResposta={
                    continuarResposta
                  }
                />

                <ChatInput
                  pergunta={pergunta}
                  carregando={carregando}
                  campoPerguntaRef={
                    campoPerguntaRef
                  }
                  onAlterarPergunta={setPergunta}
                  onPressionarTecla={
                    pressionarTecla
                  }
                  onEnviarPergunta={
                    enviarPergunta
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
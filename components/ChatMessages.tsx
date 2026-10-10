type Mensagem = {
  pergunta: string;
  resposta: string;
};

type ChatMessagesProps = {
  mensagens: Mensagem[];
  carregando: boolean;
  curtidas: number[];
  naoCurtidas: number[];
  menuAberto: number | null;

  onCopiarResposta: (resposta: string) => void;
  onCurtirResposta: (indice: number) => void;
  onNaoCurtirResposta: (indice: number) => void;
  onTentarNovamente: (indice: number) => void;

  onCompartilharResposta: (
    pergunta: string,
    resposta: string
  ) => void;

  onAlterarMenu: (indice: number | null) => void;

  onLerResposta: (resposta: string) => void;

  onSalvarResposta: (
    pergunta: string,
    resposta: string
  ) => void;

  onContinuarResposta: (item: Mensagem) => void;
};

export default function ChatMessages({
  mensagens,
  carregando,
  curtidas,
  naoCurtidas,
  menuAberto,
  onCopiarResposta,
  onCurtirResposta,
  onNaoCurtirResposta,
  onTentarNovamente,
  onCompartilharResposta,
  onAlterarMenu,
  onLerResposta,
  onSalvarResposta,
  onContinuarResposta,
}: ChatMessagesProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto py-8">
      {mensagens.length === 0 && !carregando ? (
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
                    {mensagem.resposta === "" && carregando ? (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Pensando</span>

                        <span className="flex items-center gap-1">
                          <span className="animate-bounce">
                            •
                          </span>

                          <span className="animate-bounce [animation-delay:150ms]">
                            •
                          </span>

                          <span className="animate-bounce [animation-delay:300ms]">
                            •
                          </span>
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
                          onCopiarResposta(mensagem.resposta)
                        }
                        className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                      >
                        📋 Copiar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onCurtirResposta(indice)
                        }
                        className={`rounded-lg px-3 py-1.5 text-sm transition ${
                          curtidas.includes(indice)
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                            : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                        }`}
                      >
                        👍
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onNaoCurtirResposta(indice)
                        }
                        className={`rounded-lg px-3 py-1.5 text-sm transition ${
                          naoCurtidas.includes(indice)
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                        }`}
                      >
                        👎
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onTentarNovamente(indice)
                        }
                        className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                      >
                        🔄 Tentar novamente
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onCompartilharResposta(
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
                          onAlterarMenu(
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
                                onLerResposta(
                                  mensagem.resposta
                                );

                                onAlterarMenu(null);
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                            >
                              🔊 Ler em voz alta
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSalvarResposta(
                                  mensagem.pergunta,
                                  mensagem.resposta
                                );

                                onAlterarMenu(null);
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800"
                            >
                              📌 Salvar resposta
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onContinuarResposta({
                                  pergunta:
                                    mensagem.pergunta,
                                  resposta:
                                    mensagem.resposta,
                                });

                                onAlterarMenu(null);
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
    </section>
  );
}
type RespostaSalva = {
  pergunta: string;
  resposta: string;
};

type SavedResponsesProps = {
  respostasSalvas: RespostaSalva[];
  onFechar: () => void;
  onExcluirResposta: (indice: number) => void;
};

export default function SavedResponses({
  respostasSalvas,
  onFechar,
  onExcluirResposta,
}: SavedResponsesProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden py-6">
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
          onClick={onFechar}
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

              <p>
                Nenhuma resposta salva ainda.
              </p>
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
                    onExcluirResposta(indice)
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
  );
}
type ChatHeaderProps = {
  barraAberta: boolean;
  onAbrirBarra: () => void;
  onAbrirRespostasSalvas: () => void;
};

export default function ChatHeader({
  barraAberta,
  onAbrirBarra,
  onAbrirRespostasSalvas,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[73px] shrink-0 items-center justify-between border-b border-slate-800 px-4">
      <div className="flex items-center gap-3">
        {!barraAberta && (
          <button
            type="button"
            onClick={onAbrirBarra}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Abrir barra lateral"
            title="Abrir barra lateral"
          >
            ☰
          </button>
        )}

        {!barraAberta && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl">
              ✦
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                Minha IA
              </h1>

              <p className="text-sm text-slate-500">
                Sua assistente pessoal inteligente
              </p>
            </div>
          </div>
        )}

        {barraAberta && (
          <div>
            <h1 className="text-lg font-semibold">
              Minha IA
            </h1>

            <p className="text-sm text-slate-500">
              Sua assistente pessoal inteligente
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAbrirRespostasSalvas}
        className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        📚 Respostas salvas
      </button>
    </header>
  );
}
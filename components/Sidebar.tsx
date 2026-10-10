type SidebarProps = {
  carregando: boolean;
  onNovoChat: () => void;
  onFechar: () => void;
  onAbrirRespostasSalvas: () => void;
};

export default function Sidebar({
  carregando,
  onNovoChat,
  onFechar,
  onAbrirRespostasSalvas,
}: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">
            ✦
          </div>

          <span className="font-semibold">
            Minha IA
          </span>
        </div>

        <button
          type="button"
          onClick={onFechar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Fechar barra lateral"
          title="Fechar barra lateral"
        >
          ‹
        </button>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNovoChat}
          disabled={carregando}
          className="w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Novo chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Histórico
        </p>

        <div className="rounded-xl px-2 py-3 text-sm text-slate-600">
          Seus chats aparecerão aqui.
        </div>
      </div>

      <div className="border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={onAbrirRespostasSalvas}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          📚 Respostas salvas
        </button>
      </div>
    </aside>
  );
}
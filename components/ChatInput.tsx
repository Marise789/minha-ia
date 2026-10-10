import type {
  KeyboardEvent,
  RefObject,
} from "react";

type ChatInputProps = {
  pergunta: string;
  carregando: boolean;
  campoPerguntaRef: RefObject<HTMLTextAreaElement | null>;
  onAlterarPergunta: (valor: string) => void;
  onPressionarTecla: (
    evento: KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onEnviarPergunta: () => void;
};

export default function ChatInput({
  pergunta,
  carregando,
  campoPerguntaRef,
  onAlterarPergunta,
  onPressionarTecla,
  onEnviarPergunta,
}: ChatInputProps) {
  return (
    <footer className="shrink-0 border-t border-slate-800 bg-slate-950 pt-4 pb-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-2">
        <textarea
          ref={campoPerguntaRef}
          id="pergunta"
          name="pergunta"
          value={pergunta}
          onChange={(evento) =>
            onAlterarPergunta(evento.target.value)
          }
          onKeyDown={onPressionarTecla}
          placeholder="Digite sua pergunta..."
          rows={1}
          className="max-h-32 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
        />

        <button
          type="button"
          onClick={onEnviarPergunta}
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
  );
}
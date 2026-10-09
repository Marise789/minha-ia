import OpenAI from "openai";

const openai = new OpenAI();

type MensagemHistorico = {
  pergunta: string;
  resposta: string;
};

export async function POST(request: Request) {
  const dados = await request.json();

  const pergunta = dados.pergunta;
  const historico: MensagemHistorico[] = dados.historico ?? [];

  const mensagens = historico.flatMap((mensagem) => [
    {
      role: "user" as const,
      content: mensagem.pergunta,
    },
    {
      role: "assistant" as const,
      content: mensagem.resposta,
    },
  ]);

  const resposta = await openai.responses.create({
    model: "gpt-6-astra",
    input: [
      ...mensagens,
      {
        role: "user",
        content: pergunta,
      },
    ],
  });

  return Response.json({
    resposta: resposta.output_text,
  });
}
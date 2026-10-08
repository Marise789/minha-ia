import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  const dados = await request.json();

  const pergunta = dados.pergunta;

  const resposta = await openai.responses.create({
    model: "gpt-6-astra",
    input: pergunta,
  });

  return Response.json({
    resposta: resposta.output_text,
  });
}
export const prerender = false;

export async function POST({ request }) {
  const { message } = await request.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Keep responses short and friendly.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content ?? "Sorry, I had trouble replying.";

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

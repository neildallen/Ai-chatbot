export const prerender = false;
//test
export async function POST({ request, cookies }) {
  const body = await request.json();
  const { prompt } = body;

  const alreadyGenerated = cookies.get("avatar_generated")?.value;
  if (alreadyGenerated === "yes") {
    return new Response(JSON.stringify({ error: "Avatar already generated." }), {
      status: 429,
    });
  }

  const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: "256x256",
    }),
  });

  const data = await dalleRes.json();
  console.log("DALL·E response:", data); // 👈 ADD THIS

  if (dalleRes.status !== 200) {
    return new Response(
      JSON.stringify({ error: data.error?.message || "Unknown error" }),
      { status: 500 }
    );
  }

  const imageUrl = data.data?.[0]?.url;

  cookies.set("avatar_generated", "yes", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60,
  });

  return new Response(JSON.stringify({ imageUrl }), { status: 200 });
}

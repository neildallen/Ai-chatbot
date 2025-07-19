export const prerender = false;

// ❗️NOTE: No usage limits for testing. Add rate limiting before going live!
export async function POST({ request }) {
  const body = await request.json();
  const { prompt } = body;

  try {
    const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "256x256",
      }),
    });

    const data = await dalleRes.json();
    console.log("DALL·E response:", data);

    if (!dalleRes.ok || !data?.data?.[0]?.url) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "Image generation failed" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ imageUrl: data.data[0].url }), { status: 200 });
  } catch (err) {
    console.error("Avatar generation error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

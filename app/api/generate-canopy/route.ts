import { NextRequest, NextResponse } from "next/server";

// Azure OpenAI gpt-image-2 — text-to-image only
const ENDPOINT = "https://pawan-mlcmk5lt-eastus2.services.ai.azure.com/openai/v1/images/generations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = body as { description: string };

    const apiKey = process.env.AZURE_OPENAI_IMAGE_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Image generation not configured." }, { status: 500 });
    }

    const prompt = `
A professional product marketing photo of a 10x10 custom pop-up canopy tent.
Camera angle: 3/4 perspective — the tent is rotated approximately 35 degrees so we clearly see the front-right corner. NOT straight front-on. NOT top-down. The tent appears slightly angled, like a premium product photo taken from the side-front.
The tent is fully assembled, standing on a clean white studio background with a subtle soft ground shadow.
All canopy surfaces — the roof, front valance strip, side valance strips, and back wall — are fully printed with a cohesive branded graphic design.
No people, no additional props or clutter. Ultra-realistic photorealistic rendering, professional studio lighting, sharp product detail.
Customer design description: ${description}
Branding placement: (1) brand name and logo on the rooftop center peak, (2) brand name across the full front valance band, (3) brand mark repeated on side valances, (4) hero graphic on the back wall.
The final image must look exactly like a premium e-commerce product mockup photo used on a professional brand website.
    `.trim();

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Azure OpenAI error:", errText);
      return NextResponse.json(
        { error: `Generation failed (${res.status}). Please try again.` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const imageB64: string | null = data?.data?.[0]?.b64_json ?? null;
    const imageUrl: string | null = data?.data?.[0]?.url ?? null;

    if (!imageB64 && !imageUrl) {
      return NextResponse.json({ error: "No image returned. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ imageB64, imageUrl });
  } catch (err: unknown) {
    console.error("generate-canopy error:", err);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}

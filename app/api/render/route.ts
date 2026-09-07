import { NextRequest, NextResponse } from "next/server";
import { buildRenderBlueprint } from "@/lib/render-blueprint";
import { staticRenderScenes } from "@/lib/render-scenes";
import { initialHouseState } from "@/lib/house";
import { calibrationAnchors } from "@/lib/geometry";

export const runtime = "nodejs";
export const maxDuration = 60;

function buildPrompt(scene: (typeof staticRenderScenes)[number], userPrompt?: string) {
  const room = initialHouseState.rooms.find((item) => item.id === scene.roomId);
  const elements = initialHouseState.elements
    .filter((item) => item.roomId === scene.roomId)
    .map((item) => `${item.name}: ${item.notes ?? ""}`)
    .join("\n");

  return `Create a high-fidelity architectural interior render for a real Milan apartment.

ABSOLUTE PRIORITY: preserve geometry and realistic scale over aesthetics. The attached blueprint is a geometry reference. Do not reinterpret it as a decorative floor plan. Use it to preserve object relationships, room proportions and constraints.

GLOBAL SCALE:
- Total apartment reference: ${calibrationAnchors.apartmentReferenceAreaM2} m².
- Ceiling height: ${calibrationAnchors.ceilingHeightM.toFixed(2)} m.
- This is a compact apartment. Do not make spaces feel oversized.
- Use a normal architectural camera around 35–50 mm equivalent. No fisheye, no ultra-wide lens, no exaggerated depth.

ROOM: ${room?.name ?? scene.roomId}
ROOM DESCRIPTION: ${room?.description ?? ""}
VIEW: ${scene.title}
CAMERA INTENT: ${scene.cameraIntent}

MUST SHOW:
${scene.mustShow.map((item) => `- ${item}`).join("\n")}

FIDELITY CONSTRAINTS:
${scene.fidelityNotes.map((item) => `- ${item}`).join("\n")}

HOUSE ELEMENTS:
${elements}

VISUAL TARGET:
- Quality comparable to a professional architect interior visualization or premium real-estate interior photograph.
- Realistic materials, believable joinery, correct furniture scale, natural daylight and physically plausible shadows.
- Parquet must show actual wood planks, joints and subtle tonal variation whenever present.
- Neutral contemporary Milan apartment aesthetic; avoid luxury-hotel scale, oversized furniture and empty expanses.
- Preserve doors, circulation and structural elements.

${userPrompt ? `USER REQUEST: ${userPrompt}\nApply this request only where compatible with the fixed geometry and constraints above.` : "Generate the base configuration without inventing structural changes."}

Return one landscape architectural render. No labels, captions, floor-plan graphics or text in the image.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sceneId = String(body.sceneId ?? "");
    const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : undefined;
    const scene = staticRenderScenes.find((item) => item.id === sceneId);

    if (!scene) return NextResponse.json({ error: "Unknown render scene." }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured in Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const svg = buildRenderBlueprint(scene.id, scene.cameraIntent);
    const blueprint = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    const prompt = buildPrompt(scene, userPrompt);

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: (() => {
        const form = new FormData();
        form.append("model", "gpt-image-1");
        form.append("prompt", prompt);
        form.append("size", "1536x1024");
        form.append("quality", "high");
        form.append("input_fidelity", "high");
        form.append("image", new Blob([svg], { type: "image/svg+xml" }), `${scene.id}-geometry.svg`);
        return form;
      })(),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Image generation failed.", detail: data?.error ?? data },
        { status: response.status }
      );
    }

    const b64 = data?.data?.[0]?.b64_json;
    const url = data?.data?.[0]?.url;
    if (!b64 && !url) {
      return NextResponse.json({ error: "The image API returned no image." }, { status: 502 });
    }

    return NextResponse.json({
      sceneId,
      image: b64 ? `data:image/png;base64,${b64}` : url,
      geometryReference: blueprint,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected render error." },
      { status: 500 }
    );
  }
}

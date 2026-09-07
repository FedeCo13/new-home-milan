import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "ai";
import sharp from "sharp";
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

ABSOLUTE PRIORITY: preserve geometry and realistic scale over aesthetics. The attached blueprint is a geometry reference. Do not copy its labels or graphic style into the output. Use it only to preserve object relationships, room proportions and constraints.

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
- Professional architect interior visualization / premium real-estate photography quality.
- Realistic materials, believable joinery, correct furniture scale, natural daylight and physically plausible shadows.
- Parquet must show actual wood planks, joints and subtle tonal variation whenever present.
- Neutral contemporary Milan apartment aesthetic; avoid luxury-hotel scale, oversized furniture and empty expanses.
- Preserve doors, circulation and structural elements.
- Do not add text, labels, dimension lines, floor-plan graphics or blueprint marks to the final image.

${userPrompt ? `USER REQUEST: ${userPrompt}\nApply this request only where compatible with the fixed geometry and constraints above.` : "Generate the base configuration without inventing structural changes."}

Return one landscape architectural render.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sceneId = String(body.sceneId ?? "");
    const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : undefined;
    const scene = staticRenderScenes.find((item) => item.id === sceneId);

    if (!scene) {
      return NextResponse.json({ error: "Unknown render scene." }, { status: 400 });
    }

    if (!process.env.AI_GATEWAY_API_KEY) {
      return NextResponse.json(
        { error: "AI_GATEWAY_API_KEY is not configured in Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const svg = buildRenderBlueprint(scene.id, scene.cameraIntent);
    const blueprintPng = await sharp(Buffer.from(svg)).png().toBuffer();
    const prompt = buildPrompt(scene, userPrompt);

    const { image } = await generateImage({
      model: "openai/gpt-image-1",
      prompt: {
        text: prompt,
        images: [blueprintPng],
      },
      size: "1536x1024",
      providerOptions: {
        openai: {
          quality: "high",
          inputFidelity: "high",
        },
      },
    });

    return NextResponse.json({
      sceneId,
      image: `data:${image.mediaType};base64,${image.base64}`,
    });
  } catch (error) {
    console.error("Render generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected render error." },
      { status: 500 }
    );
  }
}

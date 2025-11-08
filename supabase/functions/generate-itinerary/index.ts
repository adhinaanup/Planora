import { serve } from "https://deno.land/std/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

console.log("⚡ Supabase Edge Function started");

const apiKey = Deno.env.get("GEMINI_API_KEY");

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not defined in environment");
}

const genAI = new GoogleGenAI({ apiKey });

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Update to specific origin in production
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

serve(async (req: Request): Promise<Response> => {
  console.log(`📥 Request: ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST method allowed" }), {
      status: 405,
      headers: corsHeaders(),
    });
  }

  try {
    const body = await req.json();
    console.log("✅ JSON body received:", body);

    const { city, start_date, end_date, interests } = body;

    if (!city || !start_date || !end_date || !interests || !Array.isArray(interests)) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields" }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const prompt = `Create a detailed travel itinerary for a trip to ${city} from ${start_date} to ${end_date}. The user is interested in ${interests.join(", ")}.`;

    console.log("🤖 Sending prompt to Gemini...");

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const itinerary = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "No itinerary generated.";

    console.log("✅ AI response received");

    return new Response(JSON.stringify({ itinerary }), {
      status: 200,
      headers: corsHeaders(),
    });

  } catch (error) {
    console.error("🔥 Internal error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
});

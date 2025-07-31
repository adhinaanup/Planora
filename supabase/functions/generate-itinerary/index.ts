// supabase/functions/generate-itinerary/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// Start HTTP server
serve(async (req: Request): Promise<Response> => {
  try {
    // Ensure it's a POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST method allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse JSON body
    const body = await req.json();

    const { city, start_date, end_date, interests } = body;

    if (!city || !start_date || !end_date || !interests) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create prompt for Gemini
    const prompt = `Create a detailed travel itinerary for a trip to ${city} from ${start_date} to ${end_date}. The user is interested in ${interests.join(
      ", "
    )}. Include things to do each day, best places to visit, and local tips.`;

    // Use Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ itinerary: text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

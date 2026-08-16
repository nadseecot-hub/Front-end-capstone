import { NextRequest } from "next/server";
import { SYSTEM_PROMPT, OPENROUTER_CONFIG, CHAT_DEFAULTS } from "@/features/ChatWidget/ChatModel";

/* ==========================================================================
   Chat API Route — handles streaming responses from OpenRouter
   
   This route:
   - Receives messages from the client
   - Calls OpenRouter API with streaming enabled
   - Returns a Server-Sent Events (SSE) stream to the client
   
   The AI SDK's useChat hook on the client handles parsing this stream.
   ========================================================================== */

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Chat service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const messagesWithSystem = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": OPENROUTER_CONFIG.siteUrl,
        "X-Title": OPENROUTER_CONFIG.siteName,
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.model,
        messages: messagesWithSystem,
        max_tokens: CHAT_DEFAULTS.maxTokens,
        temperature: CHAT_DEFAULTS.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", response.status, errorData);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const reader = response.body?.getReader();

    if (!reader) {
      return new Response(
        JSON.stringify({ error: "No response stream available" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim() !== "");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    const formattedChunk = JSON.stringify({
                      choices: [{ delta: { content } }],
                    });
                    controller.enqueue(
                      encoder.encode(`data: ${formattedChunk}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed JSON chunks
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

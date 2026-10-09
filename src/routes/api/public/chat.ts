import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { z } from "zod";
import { ASSISTANT_INSTRUCTIONS, ASSISTANT_MODEL } from "@/lib/site-assistant";

const Body = z.object({
  conversationId: z.string().uuid(),
  action: z.enum(["history", "send"]).default("send"),
  message: z.string().max(2000).optional(),
});

const json = (body: unknown, status = 200) => Response.json(body, { status });

// Public endpoint for the website chat bubble. Visitors are anonymous; each
// browser keeps a random conversation id. Only that conversation is read.
export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = Body.safeParse(await request.json());
        } catch {
          return json({ error: "Invalid request" }, 400);
        }
        if (!parsed.success) return json({ error: "Invalid request" }, 400);
        const { conversationId, action } = parsed.data;

        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");

        const { data: history, error: histErr } = await db
          .from("chat_messages")
          .select("role, content")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(60);
        if (histErr) {
          console.error("history", histErr);
          return json({ error: "Could not load the conversation" }, 500);
        }
        if (action === "history") return json({ messages: history ?? [] });

        const message = (parsed.data.message ?? "").trim();
        if (!message) return json({ error: "Message is empty" }, 400);

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return json({ error: "Assistant is not configured" }, 500);

        const { error: insErr } = await db
          .from("chat_messages")
          .insert({ conversation_id: conversationId, role: "user", content: message });
        if (insErr) {
          console.error("insert user", insErr);
          return json({ error: "Could not save your message" }, 500);
        }

        const messages: ModelMessage[] = [
          ...(history ?? []).slice(-30).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: message },
        ];

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });

        let failure: string | null = null;
        const result = streamText({
          model: provider.responses(ASSISTANT_MODEL),
          system: ASSISTANT_INSTRUCTIONS,
          messages,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => {
            console.error("ai", error);
            const status = (error as { statusCode?: number })?.statusCode;
            failure =
              status === 429
                ? "The assistant is busy right now. Please try again in a moment."
                : status === 402 || status === 403
                  ? "The assistant is temporarily unavailable. Please contact us on Telegram."
                  : "Something went wrong. Please try again.";
          },
          onFinish: async ({ text }) => {
            if (!text.trim()) return;
            const { error } = await db
              .from("chat_messages")
              .insert({ conversation_id: conversationId, role: "assistant", content: text });
            if (error) console.error("insert assistant", error);
          },
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
            } catch (e) {
              console.error("stream", e);
              failure ??= "Something went wrong. Please try again.";
            }
            if (failure) controller.enqueue(encoder.encode(`\n\n[[ERROR]]${failure}`));
            controller.close();
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      },
    },
  },
});

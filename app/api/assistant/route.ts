import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { plugvAgent } from "@/lib/ai/plugv-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

const requests = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUEST_BYTES = 64 * 1024;

function allowed(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "anonymous";
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 12;
}

export async function POST(request: Request) {
  if (!allowed(request)) return Response.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json({ error: "This conversation is too large. Start a new chat and try again." }, { status: 413 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = (await request.json()) as { messages?: UIMessage[] };
  } catch {
    return Response.json({ error: "The request could not be read." }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 30) {
    return Response.json({ error: "A valid conversation is required." }, { status: 400 });
  }

  return createAgentUIStreamResponse({
    agent: plugvAgent,
    uiMessages: body.messages,
    abortSignal: request.signal,
    onError: () => "PlugV Copilot could not complete that request. Please try again or use the Explore, Compare, Charging or Travel tools directly.",
  });
}

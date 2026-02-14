import { NextResponse } from "next/server";

type ApiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type Confidence = "low" | "medium" | "high";

type SummaryField = {
  label: string;
  value: string;
  confidence: Confidence;
};

type SummaryState = {
  title: SummaryField;
  serviceType: SummaryField;
  budget: SummaryField;
  deadline: SummaryField;
  requirements: SummaryField;
  deliverables: SummaryField;
  risks: SummaryField;
};

type AssistantRequest = {
  action: "chat" | "summary";
  messages: ApiMessage[];
};

const chatSystemPrompt =
  "You are the SkillLink Nexus Project Assistant, an AI-style intake assistant. " +
  "Goal: help clients describe what they want to build, collect key details, and prepare a project brief. " +
  "Tone: professional, calm, direct. Short messages only. One question at a time. " +
  "Always mirror the client’s words (e.g., 'You said...'). " +
  "Avoid long paragraphs. Provide a clear next step every time. " +
  "When unsure, say 'Based on what you shared...' or 'To finalize your brief, I need 2 more details...'. " +
  "Use quick options labels in brackets when helpful (e.g., [Website], [Chatbot], [Branding]). " +
  "Do not claim you assigned someone; say the platform will assign after submission. " +
  "Start the conversation with a short greeting and this opener: 'Tell me what you need, and I’ll summarize it into a project brief and route it to the right specialist.'";

const summarySystemPrompt =
  "Extract a structured project brief from the conversation. " +
  "Return JSON only. Use 'TBD' when missing. Keep values concise. " +
  "Brief must include: project title, project type, goal, deliverables, timeline, budget, required assets, suggested roles, risks/assumptions.";

const summarySchema = {
  name: "project_summary",
  schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      serviceType: { type: "string" },
      budget: { type: "string" },
      deadline: { type: "string" },
      requirements: { type: "string" },
      deliverables: { type: "string" },
      risks: { type: "string" },
      goal: { type: "string" },
      assets: { type: "string" },
      roles: { type: "string" },
      confidence: {
        type: "object",
        properties: {
          title: { type: "string", enum: ["low", "medium", "high"] },
          serviceType: { type: "string", enum: ["low", "medium", "high"] },
          budget: { type: "string", enum: ["low", "medium", "high"] },
          deadline: { type: "string", enum: ["low", "medium", "high"] },
          requirements: { type: "string", enum: ["low", "medium", "high"] },
          deliverables: { type: "string", enum: ["low", "medium", "high"] },
          risks: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["title", "serviceType", "budget", "deadline", "requirements", "deliverables", "risks"],
        additionalProperties: false
      }
    },
    required: [
      "title",
      "serviceType",
      "budget",
      "deadline",
      "requirements",
      "deliverables",
      "risks",
      "goal",
      "assets",
      "roles",
      "confidence"
    ],
    additionalProperties: false
  }
};

const toSummary = (payload: any): SummaryState => {
  const confidence = payload?.confidence ?? {};
  const toConfidence = (value: string): Confidence =>
    value === "high" || value === "medium" ? value : "low";

  const buildField = (label: string, value: string, conf: string): SummaryField => ({
    label,
    value: value && value.trim() ? value : "TBD",
    confidence: toConfidence(conf)
  });

  return {
    title: buildField("Project title", payload?.title, confidence?.title),
    serviceType: buildField("Project type", payload?.serviceType, confidence?.serviceType),
    budget: buildField("Budget range", payload?.budget, confidence?.budget),
    deadline: buildField("Timeline", payload?.deadline, confidence?.deadline),
    requirements: buildField("Goal", payload?.goal ?? payload?.requirements, confidence?.requirements),
    deliverables: buildField("Deliverables", payload?.deliverables, confidence?.deliverables),
    risks: buildField("Risks / assumptions", payload?.risks, confidence?.risks)
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = (await request.json()) as AssistantRequest;
  const messages = body?.messages ?? [];

  if (body?.action === "summary") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          { role: "system", content: summarySystemPrompt },
          ...messages
        ],
        response_format: {
          type: "json_schema",
          json_schema: summarySchema
        },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }

    return NextResponse.json({ summary: toSummary(parsed) });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [{ role: "system", content: chatSystemPrompt }, ...messages],
      stream: true,
      temperature: 0.6
    })
  });

  if (!response.ok || !response.body) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

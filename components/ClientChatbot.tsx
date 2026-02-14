"use client";

import { memo, useMemo, useRef, useState } from "react";
import { addProject } from "@/lib/mockDb";

type Sender = "ai" | "user" | "system";

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
};

type ChatStage = "collecting" | "review" | "pushed";

type ProjectBrief = {
  title: string;
  category: string;
  goals: string;
  deliverablesChecklist: string[];
  budgetEstimate: string;
  estimatedTimeline: string;
  requiredAssets: string[];
  risksAssumptions: string[];
};

const CATEGORIES = ["Website", "Chatbot", "Branding", "Marketing", "Software"];

const QUESTIONS = [
  {
    id: "category",
    label: "What kind of project is this? (Website, Chatbot, Branding, Marketing, Software)"
  },
  {
    id: "goal",
    label: "In simple words, what do you want us to build or do for you?"
  },
  {
    id: "deliverables",
    label: "What should we deliver? (List the outputs you expect)"
  },
  {
    id: "budget",
    label: "What budget range should we plan for?"
  },
  {
    id: "timeline",
    label: "When do you need it ready?"
  },
  {
    id: "assets",
    label: "What assets will you provide? (brand files, content, data, etc.)"
  },
  {
    id: "risks",
    label: "Any risks or assumptions we should note?"
  }
];

const createMessage = (sender: Sender, text: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  text
});

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeCategory = (value: string) => {
  const match = CATEGORIES.find((category) => category.toLowerCase() === value.trim().toLowerCase());
  const trimmed = value.trim();
  return match ?? (trimmed || "Website");
};

const buildBrief = (answers: Record<string, string>): ProjectBrief => {
  const category = normalizeCategory(answers.category ?? "");
  const goals = answers.goal ?? "";
  const titleBase = goals.split(".")[0]?.trim();
  const title = titleBase ? `${category} - ${titleBase}` : `${category} Project`;

  return {
    title,
    category,
    goals,
    deliverablesChecklist: parseList(answers.deliverables ?? ""),
    budgetEstimate: answers.budget ?? "",
    estimatedTimeline: answers.timeline ?? "",
    requiredAssets: parseList(answers.assets ?? ""),
    risksAssumptions: parseList(answers.risks ?? "")
  };
};

const formatBrief = (brief: ProjectBrief) => {
  const lines = [
    "SkillLink Nexus - Project Brief",
    "",
    "Summary",
    `- Project title: ${brief.title}`,
    `- Category: ${brief.category}`,
    `- Goals: ${brief.goals}`,
    "",
    "Deliverables",
    brief.deliverablesChecklist.length > 0
      ? brief.deliverablesChecklist.map((item) => `- ${item}`).join("\n")
      : "- TBD",
    "",
    "Timeline & Budget",
    `- Estimated timeline: ${brief.estimatedTimeline || "TBD"}`,
    `- Budget estimate: ${brief.budgetEstimate || "TBD"}`,
    "",
    "Required Assets",
    brief.requiredAssets.length > 0
      ? brief.requiredAssets.map((item) => `- ${item}`).join("\n")
      : "- TBD",
    "",
    "Risks / Assumptions",
    brief.risksAssumptions.length > 0
      ? brief.risksAssumptions.map((item) => `- ${item}`).join("\n")
      : "- TBD"
  ];

  return lines.join("\n");
};

const estimateDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 28);
  return date.toISOString().split("T")[0];
};

function ClientChatbot() {
  // Accept introText prop
  const introText = typeof window !== "undefined" && (window as any).introText || "Hi! I am your SkillLink Nexus assistant. I will ask a few simple questions to turn your idea into a clear project plan.";
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("ai", introText),
    createMessage("ai", QUESTIONS[0].label)
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<ChatStage>("collecting");
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const documentation = useMemo(() => {
    if (!brief || stage === "collecting") {
      return "";
    }

    return formatBrief(brief);
  }, [brief, stage]);

  const handleSubmit = () => {
    if (stage !== "collecting") {
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const currentQuestion = QUESTIONS[questionIndex];
    const nextIndex = questionIndex + 1;

    setMessages((prev) => [...prev, createMessage("user", trimmed)]);
    const nextAnswers = { ...answers, [currentQuestion.id]: trimmed };
    setAnswers(nextAnswers);
    setInput("");

    if (nextIndex < QUESTIONS.length) {
      const nextQuestion = QUESTIONS[nextIndex];
      setMessages((prev) => [...prev, createMessage("ai", nextQuestion.label)]);
      setQuestionIndex(nextIndex);
      return;
    }

    const nextBrief = buildBrief(nextAnswers);
    setBrief(nextBrief);
    setMessages((prev) => [
      ...prev,
      createMessage("ai", "Great. I drafted your project brief. Review it below, edit anything, then submit it to SkillLink Nexus.")
    ]);
    setStage("review");
  };

  const handleReset = () => {
    setAnswers({});
    setQuestionIndex(0);
    setMessages([
      createMessage("ai", "No problem. Lets start fresh and capture your idea again."),
      createMessage("ai", QUESTIONS[0].label)
    ]);
    setStage("collecting");
    setBrief(null);
    setAudioUrl(null);
    setRecordingError(null);
  };

  const handlePush = () => {
    if (!brief) {
      return;
    }

    addProject({
      title: brief.title,
      client: "Client Account",
      serviceType: brief.category,
      category: brief.category,
      description: brief.goals,
      budgetRange: brief.budgetEstimate || "TBD",
      budgetEstimate: brief.budgetEstimate || "TBD",
      quoteAmount: brief.budgetEstimate || "TBD",
      amountPaid: "KES 0",
      paymentMethod: "Unspecified",
      freelancerPayout: "KES 0",
      margin: "KES 0",
      estimatedTimeline: brief.estimatedTimeline || "TBD",
      deadline: estimateDeadline(),
      status: "New",
      assignedSpecialistRole: "Unassigned",
      assignedRoles: [],
      deliverablesChecklist: brief.deliverablesChecklist,
      requiredAssets: brief.requiredAssets,
      risksAssumptions: brief.risksAssumptions,
      clientContext: "Client type: SME, Sector: General"
    });

    setStage("pushed");
    setMessages((prev) => [
      ...prev,
      createMessage("system", "All set. Your project plan has been sent to SkillLink Nexus. A project manager will reach out shortly.")
    ]);
  };

  const startRecording = async () => {
    if (isRecording) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingError("Voice recording is not supported in this browser.");
      return;
    }

    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        setMessages((prev) => [
          ...prev,
          createMessage("system", "Voice note saved. You can keep typing answers or leave it for our team to review.")
        ]);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setRecordingError("Unable to start recording. Please check microphone permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) {
      return;
    }

    recorderRef.current.stop();
    recorderRef.current = null;
  };

  const updateBriefField = <K extends keyof ProjectBrief>(field: K, value: ProjectBrief[K]) => {
    if (!brief) {
      return;
    }
    setBrief({ ...brief, [field]: value });
  };

  return (
    <section className="chatbot-card">
      <div className="chatbot-header">
        <div>
          <h2 className="chatbot-title">Idea Chatbot</h2>
          <p className="chatbot-subtitle">
            Tell us your idea in plain language and we will build the project plan for you.
          </p>
        </div>
        <div className={`chatbot-status ${stage}`}>{stage === "collecting" ? "Collecting" : stage === "review" ? "Review" : "Pushed"}</div>
      </div>

      <div className="chatbot-body">
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message ${message.sender}`}>
              <div className="chatbot-bubble">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="chatbot-panel">
          {stage === "review" && brief && (
            <div className="chatbot-brief-editor">
              <div className="form-group">
                <label className="form-label">Project title</label>
                <input
                  className="form-input"
                  value={brief.title}
                  onChange={(event) => updateBriefField("title", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={brief.category}
                  onChange={(event) => updateBriefField("category", event.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Goals</label>
                <textarea
                  className="form-textarea"
                  value={brief.goals}
                  onChange={(event) => updateBriefField("goals", event.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Deliverables checklist (comma separated)</label>
                <textarea
                  className="form-textarea"
                  value={brief.deliverablesChecklist.join(", ")}
                  onChange={(event) => updateBriefField("deliverablesChecklist", parseList(event.target.value))}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated timeline</label>
                <input
                  className="form-input"
                  value={brief.estimatedTimeline}
                  onChange={(event) => updateBriefField("estimatedTimeline", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Budget estimate or range</label>
                <input
                  className="form-input"
                  value={brief.budgetEstimate}
                  onChange={(event) => updateBriefField("budgetEstimate", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Required assets (comma separated)</label>
                <textarea
                  className="form-textarea"
                  value={brief.requiredAssets.join(", ")}
                  onChange={(event) => updateBriefField("requiredAssets", parseList(event.target.value))}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Risks / assumptions (comma separated)</label>
                <textarea
                  className="form-textarea"
                  value={brief.risksAssumptions.join(", ")}
                  onChange={(event) => updateBriefField("risksAssumptions", parseList(event.target.value))}
                ></textarea>
              </div>
            </div>
          )}
          {stage === "collecting" ? (
            <div className="chatbot-input-row">
              <input
                className="chatbot-input"
                placeholder="Type your answer in simple words..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                Send
              </button>
              <button
                className={`chatbot-record-btn ${isRecording ? "recording" : ""}`}
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <span className="chatbot-record-icon" aria-hidden="true">🎙️</span>
              </button>
            </div>
          ) : (
            <div className="chatbot-actions">
              {stage === "review" ? (
                <>
                  <button className="btn btn-secondary" type="button" onClick={handleReset}>
                    Start Over
                  </button>
                  <button className="btn btn-primary" type="button" onClick={handlePush}>
                    Submit to SkillLink Nexus
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary" type="button" onClick={handleReset}>
                  Start New Brief
                </button>
              )}
            </div>
          )}

          {stage !== "collecting" && (
            <div className="chatbot-doc">
              <div className="chatbot-doc-title">Generated Documentation</div>
              <pre>{documentation}</pre>
            </div>
          )}

          {stage === "collecting" && recordingError && (
            <p className="chatbot-voice-error">{recordingError}</p>
          )}
          {stage === "collecting" && audioUrl && (
            <div className="chatbot-voice-player">
              <audio controls src={audioUrl} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Accept introText prop
interface ClientChatbotProps {
  introText?: string;
}

function ClientChatbotWithProps(props: ClientChatbotProps) {
  return <ClientChatbot {...props} />;
}

export default memo(ClientChatbotWithProps);

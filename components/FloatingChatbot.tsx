"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; sender: "user" | "assistant"; text: string }>>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasContent = message.trim().length > 0;

  const emojiList = [
    { char: "😀", label: "grinning" },
    { char: "😊", label: "smile" },
    { char: "😄", label: "happy" },
    { char: "😂", label: "joy" },
    { char: "😍", label: "love" },
    { char: "😎", label: "cool" },
    { char: "🤩", label: "star" },
    { char: "🥳", label: "party" },
    { char: "😅", label: "relief" },
    { char: "😇", label: "angel" },
    { char: "🤗", label: "hug" },
    { char: "😉", label: "wink" },
    { char: "😴", label: "sleep" },
    { char: "😮", label: "wow" },
    { char: "😢", label: "sad" },
    { char: "😭", label: "cry" },
    { char: "😤", label: "frustrated" },
    { char: "🤔", label: "thinking" },
    { char: "🙌", label: "celebrate" },
      { char: "??", label: "thumbs up" },
    { char: "🙏", label: "pray" },
    { char: "✅", label: "check" },
    { char: "🚀", label: "rocket" },
    { char: "✨", label: "sparkle" }
  ];

  const filteredEmojis = emojiList.filter((emoji) =>
    emoji.label.includes(emojiSearch.trim().toLowerCase())
  );

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const knowledgeBase = useMemo(
    () => [
      {
        keywords: ["what is", "skilllink", "platform", "nexus"],
        answer:
          "SkillLink Nexus is a managed project delivery platform that helps SMEs get professional work done without hiring full-time staff. You submit a request and we deliver through scoping, assignment, milestones, communication, and quality control."
      },
      {
        keywords: ["who is it for", "who is", "target", "audience"],
        answer:
          "It is built for SMEs, startups, founders, NGOs, and growing teams that need professional execution without adding headcount."
      },
      {
        keywords: ["marketplace", "upwork", "fiverr", "freelancer"],
        answer:
          "SkillLink Nexus is not a freelancer marketplace. You do not browse profiles or hire directly. We assign vetted specialists internally and manage delivery end-to-end."
      },
      {
        keywords: ["agency", "agencies"],
        answer:
          "Compared to agencies, SkillLink Nexus is faster, fixed-scope, and flexible with specialist assignment, with standardized delivery through software."
      },
      {
        keywords: ["request", "services", "what can i request", "categories"],
        answer:
          "You can request websites, landing pages, redesigns, SEO setup, AI & automation (chatbots/workflows), branding & design (logos, decks, UI/UX), and marketing setup (social, campaigns, content planning, basic ads)."
      },
      {
        keywords: ["pricing", "price", "cost", "how much"],
        answer:
          "Pricing is determined by the complexity of the project. You can log in to submit a project, or request access as a client to get a scoped quote."
      },
      {
        keywords: ["how it works", "workflow", "process"],
        answer:
          "Process: 1) Submit a request. 2) Get a structured brief with deliverables, timeline, budget, assets, roles. 3) We assign vetted specialists. 4) Track milestones, deadlines, deliverables in your dashboard. 5) Communicate with role-based specialists. 6) Approve milestones and complete the project."
      },
      {
        keywords: ["track", "progress", "dashboard", "milestones"],
        answer:
          "Yes, you can track milestones, deadlines, deliverables, approvals, files, and progress updates in your dashboard."
      },
      {
        keywords: ["communicate", "chat", "messages"],
        answer:
          "Yes. You communicate in one place with role-based specialists (Developer, Designer, Marketer, Project Manager), which keeps everything organized."
      },
      {
        keywords: ["revisions", "changes"],
        answer:
          "Revisions are handled through milestone review and feedback loops, with approvals built in."
      },
      {
        keywords: ["quality", "quality control", "qa"],
        answer:
          "Quality control is built in. Deliverables go through internal checks before reaching the client to reduce inconsistencies and rework."
      },
      {
        keywords: ["ai", "automation", "intake"],
        answer:
          "AI-assisted intake is coming to generate project briefs, classify tasks, and speed up matching and scoping. It improves speed and clarity, not replacing delivery."
      },
      {
        keywords: ["start", "get started", "begin"],
        answer:
          "To start, submit a project request through the platform and describe what you need."
      }
    ],
    []
  );

  const getAssistantReply = (input: string) => {
    const text = input.toLowerCase();

    if (text.includes("how are you")) {
      return "I'm doing great, thanks. How should I help you please?";
    }

    const match = knowledgeBase.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)));
    if (match) {
      return `${match.answer} Thank you for your question!`;
    }

    return "Thanks for reaching out. How can I help you today?";
  };

  const handleEmojiPick = (emoji: string) => {
    setMessage((prev) => `${prev}${emoji}`);
    setShowEmoji(false);
  };

  const handleGifPick = (gifLabel: string) => {
    setMessage((prev) => `${prev}${gifLabel}`);
    setShowGif(false);
  };

  const handleRecordToggle = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      setMessage((prev) => `${prev}${prev ? " " : ""}[Voice note recording]`);
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    const trimmed = message.trim();
    const reply = getAssistantReply(trimmed);
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-u`, sender: "user", text: trimmed },
      { id: `${Date.now()}-a`, sender: "assistant", text: reply }
    ]);
    setMessage("");
    setShowEmoji(false);
    setShowGif(false);
    setIsRecording(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {isOpen && (
        <div className="mb-3 w-[360px] max-w-[92vw] rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2329] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                className="rounded-full px-2 py-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Back"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
                  <Image src="/logo.png" alt="Nexus Assistant" width={32} height={32} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Nexus Assistant</div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full px-2 py-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                type="button"
                aria-label="Menu"
              >
                ⋯
              </button>
              <button
                className="rounded-full px-2 py-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex min-h-[520px] flex-col justify-between px-6 pb-6 pt-2">
            <div className="space-y-3">
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                Ask us anything, or share your feedback.
              </div>
              {messages.length > 0 && (
                <div className="space-y-2">
                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          item.sender === "user"
                            ? "bg-purple-100 text-slate-800 dark:bg-purple-500/20 dark:text-purple-200"
                            : "bg-slate-100 text-slate-700 dark:bg-[#2B3139] dark:text-slate-200"
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative mt-6 rounded-2xl border border-blue-600 dark:border-purple-500/40 px-4 py-3">
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                onChange={() => setMessage((prev) => `${prev}${prev ? " " : ""}[Attachment added]`)}
              />
              {showEmoji && (
                <div className="absolute bottom-14 left-0 w-[280px] rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2329] p-3 text-slate-600 dark:text-slate-300 shadow-xl">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-2 py-1.5 text-xs">
                    <span aria-hidden="true">🔍</span>
                    <input
                      className="w-full border-none bg-transparent text-xs outline-none"
                      placeholder="Search emoji..."
                      value={emojiSearch}
                      onChange={(event) => setEmojiSearch(event.target.value)}
                    />
                  </div>
                  <div className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Smileys & Emotion
                  </div>
                  <div className="mt-2 grid max-h-40 grid-cols-6 gap-2 overflow-y-auto">
                    {filteredEmojis.map((emoji) => (
                      <button
                        key={emoji.char}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-lg hover:border-slate-200 dark:hover:border-white/10"
                        type="button"
                        onClick={() => handleEmojiPick(emoji.char)}
                        aria-label={emoji.label}
                      >
                        {emoji.char}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                className="w-full border-none bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none"
                placeholder="Message..."
                aria-label="Message"
                value={message}
                onFocus={() => {
                  if (showEmoji) {
                    setShowEmoji(false);
                  }
                  if (showGif) {
                    setShowGif(false);
                  }
                }}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (showEmoji) {
                    setShowEmoji(false);
                  }
                  if (showGif) {
                    setShowGif(false);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="mt-3 flex items-center justify-between text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-3 text-sm">
                  <button
                    className="inline-flex"
                    type="button"
                    onClick={handleAttachClick}
                    aria-label="Attach a file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8 12.5 12.5 8a4 4 0 0 1 5.7 5.7l-6.3 6.3a6 6 0 0 1-8.5-8.5L10 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="inline-flex"
                    type="button"
                    onClick={() => {
                      setShowEmoji((prev) => !prev);
                      setShowGif(false);
                      setEmojiSearch("");
                    }}
                    aria-label="Open emoji picker"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M9 11h.01M15 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9 15c1.2 1 4.8 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className="rounded border border-slate-200 dark:border-white/10 px-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                    type="button"
                    onClick={() => {
                      setShowGif((prev) => !prev);
                      setShowEmoji(false);
                    }}
                    aria-label="Open GIF picker"
                  >
                    GIF
                  </button>
                  <button
                    className={`inline-flex ${isRecording ? "text-rose-500" : ""}`}
                    type="button"
                    onClick={handleRecordToggle}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="5" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M12 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <button
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                    hasContent
                      ? "bg-purple-700 text-white hover:bg-purple-800"
                      : "bg-slate-100 text-slate-300 dark:bg-white/10 dark:text-slate-500"
                  }`}
                  type="button"
                  aria-label="Send"
                  aria-disabled={!hasContent}
                  disabled={!hasContent}
                  onClick={handleSend}
                >
                  ↑
                </button>
              </div>

              {showGif && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {["[GIF: Hi]", "[GIF: Thank you]", "[GIF: On it]"] .map((gif) => (
                    <button
                      key={gif}
                      className="rounded border border-slate-200 dark:border-white/10 px-2 py-1 text-slate-600 dark:text-slate-300"
                      type="button"
                      onClick={() => handleGifPick(gif)}
                    >
                      {gif}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-white shadow-lg transition hover:bg-purple-800"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 4h6l1.2 2.4 2.6.8v5.6c0 3.6-3 6.6-6.6 6.6H11c-3.6 0-6.6-3-6.6-6.6V7.2l2.6-.8L9 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="11" r="1" fill="currentColor" />
            <circle cx="15" cy="11" r="1" fill="currentColor" />
            <path d="M9 15c1.5 1.2 4.5 1.2 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

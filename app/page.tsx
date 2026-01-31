"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const ENTITY_TYPES = [
  { value: "PFA", label: "PFA" },
  { value: "SRL", label: "SRL" },
  { value: "Individual", label: "Individual" },
  { value: "NGO", label: "NGO" },
  { value: "Academic", label: "Academic" },
];

const MAX_MESSAGES = 20;

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [background, setBackground] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [entityType, setEntityType] = useState("");
  const [formErrors, setFormErrors] = useState<{
    background?: string;
    entityType?: string;
  }>({});
  const [input, setInput] = useState("");
  const [showThinking, setShowThinking] = useState(false);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  const isBusy = status === "submitted" || status === "streaming";

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus chat input after form collapse
  useEffect(() => {
    if (formCollapsed) {
      const timer = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [formCollapsed]);

  // Show "Thinking..." after 5s of waiting
  useEffect(() => {
    if (status !== "submitted") {
      // Only reset when transitioning away from submitted
      return;
    }
    const timer = setTimeout(() => {
      setShowThinking(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
      setShowThinking(false);
    };
  }, [status]);

  const handleProfileSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const errors: { background?: string; entityType?: string } = {};

      if (background.trim().length < 10) {
        errors.background = "Please describe your background (at least 10 characters)";
      }
      if (!entityType) {
        errors.entityType = "Please select your entity type";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setFormSubmitted(true);

      // Collapse form with animation
      setTimeout(() => setFormCollapsed(true), 50);

      // Build first message
      const links = [
        github && `GitHub: ${github}`,
        linkedin && `LinkedIn: ${linkedin}`,
        website && `Website: ${website}`,
      ]
        .filter(Boolean)
        .join(", ");

      const firstMessage = [
        `Background: ${background.trim()}`,
        links && `Links: ${links}`,
        `Entity type: ${entityType}`,
        "",
        "Based on this profile, what EU funding opportunities match me?",
      ]
        .filter((line) => line !== undefined)
        .join("\n");

      sendMessage({ text: firstMessage });
    },
    [background, entityType, github, linkedin, website, sendMessage]
  );

  const handleChatSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isBusy || messages.length >= MAX_MESSAGES) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, isBusy, messages.length, sendMessage]
  );

  const isAtLimit = messages.length >= MAX_MESSAGES;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-xl font-semibold text-primary">OpenFundsEU</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered EU grant matching
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Profile Form */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            formCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
          }`}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Your Background</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Background textarea */}
                <div className="space-y-2">
                  <Label htmlFor="background">
                    Tell us about yourself and what you do
                  </Label>
                  <Textarea
                    id="background"
                    placeholder="I'm a freelance developer based in Romania, working on open-source privacy tools..."
                    rows={5}
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className={
                      formErrors.background
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {formErrors.background && (
                    <p className="text-sm text-destructive">
                      {formErrors.background}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <Label>Relevant Links (optional)</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">
                        GitHub
                      </span>
                      <Input
                        placeholder="https://github.com/..."
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">
                        LinkedIn
                      </span>
                      <Input
                        placeholder="https://linkedin.com/in/..."
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">
                        Website
                      </span>
                      <Input
                        placeholder="https://..."
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Entity Type */}
                <div className="space-y-2">
                  <Label>Entity Type</Label>
                  <RadioGroup
                    value={entityType}
                    onValueChange={setEntityType}
                    className="flex flex-wrap gap-4"
                  >
                    {ENTITY_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={type.value}
                          id={`entity-${type.value}`}
                        />
                        <Label
                          htmlFor={`entity-${type.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {formErrors.entityType && (
                    <p className="text-sm text-destructive">
                      {formErrors.entityType}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={formSubmitted}
                >
                  {formSubmitted ? "Finding your grants..." : "Find My Grants →"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        {formSubmitted && (
          <section
            className={`transition-opacity duration-300 ${
              formCollapsed ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                <div
                  role="log"
                  aria-live="polite"
                  aria-label="Chat messages"
                  className="space-y-4 py-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-user-message text-foreground"
                            : "bg-white border border-border text-foreground"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
                            <ReactMarkdown
                              components={{
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline hover:text-primary/80"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {message.parts
                                ?.filter(
                                  (p): p is { type: "text"; text: string } =>
                                    p.type === "text"
                                )
                                .map((p) => p.text)
                                .join("") || ""}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">
                            {message.parts
                              ?.filter(
                                (p): p is { type: "text"; text: string } =>
                                  p.type === "text"
                              )
                              .map((p) => p.text)
                              .join("") || ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Thinking indicator */}
                  {showThinking && isBusy && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-border rounded-lg px-4 py-3">
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Thinking...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {error && (
                    <div className="flex justify-start">
                      <div className="bg-red-50 border border-destructive/20 rounded-lg px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-destructive">
                          Something went wrong. Try sending your message again.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message cap */}
                  {isAtLimit && (
                    <div className="flex justify-center">
                      <p className="text-sm text-muted-foreground bg-muted rounded-lg px-4 py-2">
                        You&apos;ve reached the conversation limit. Refresh the
                        page to start a new session.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t border-border bg-white pt-4 pb-2">
                <form
                  onSubmit={handleChatSubmit}
                  className="flex gap-3 items-end"
                >
                  <Textarea
                    ref={chatInputRef}
                    placeholder="Ask about a grant, eligibility, or get help with a proposal..."
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                    disabled={isAtLimit}
                    className="flex-1 resize-none"
                    aria-label="Chat message input"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isBusy || isAtLimit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Send message"
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

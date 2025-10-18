import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Mic, Sparkles, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  jobCard?: {
    title: string;
    company: string;
    matchScore: number;
  };
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your job search assistant. I can help you find jobs, answer questions about your career, and provide personalized recommendations. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I found some great opportunities that match your query! Here's a job that might interest you:",
        timestamp: new Date(),
        jobCard: {
          title: "Digital Marketing Assistant",
          company: "Tech Solutions Ltd",
          matchScore: 85,
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    // Implement Web Speech API
    console.log("Voice input started");
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">
            Chat with our AI to find jobs and get career advice
          </p>
        </div>

        <Card className="shadow-card border-border h-[600px] flex flex-col">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>JobMatch Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user"
                      ? "bg-primary"
                      : "bg-gradient-hero"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[75%] space-y-2",
                    message.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.jobCard && (
                    <Card className="shadow-soft border-border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {message.jobCard.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {message.jobCard.company}
                            </p>
                          </div>
                          <Badge className="bg-gradient-hero text-primary-foreground">
                            {message.jobCard.matchScore}% Match
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-hero">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <p className="text-xs text-muted-foreground px-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-100" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-200" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className="flex-shrink-0"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-hero shadow-soft"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-accent-foreground/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Quick Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ask about specific job roles or industries</li>
                <li>• Request personalized skill recommendations</li>
                <li>• Get help with your resume or interview prep</li>
                <li>• Use voice input for easier communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

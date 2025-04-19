
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { SendIcon, CopyIcon, CheckIcon, LoaderIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

import { type message, useMessages } from '@/hooks/use-messages';

export function AIChat() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, addMessage, clearMessages } = useMessages();

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please set your Gemini API key in the settings.",
        variant: "destructive",
      });
      return;
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate a response.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    addMessage({ role: 'user', content: prompt });
    const controller = new AbortController();
    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });
      

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate response.');
      }

      const data = await response.json();
      console.log(data)
      const reply = data?.response || 'No response generated';
      addMessage({ role: 'assistant', content: reply });
      setPrompt('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div 
            className="flex justify-end mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearMessages}
              className="text-xs"
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              Clear History
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <Card className={cn(
                "max-w-[80%]",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        {isCopied ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <Card className="sticky bottom-0 backdrop-blur-sm bg-background/80">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              ref={textareaRef}
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                autoResizeTextarea();
              }}
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

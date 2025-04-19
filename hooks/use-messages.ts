"use client";

import { useState, useEffect } from 'react';

export type message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useMessages() {
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem('ai-chat-messages');
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
        localStorage.removeItem('ai-chat-messages');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
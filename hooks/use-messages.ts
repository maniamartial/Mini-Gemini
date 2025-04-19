"use client";

import { useState, useEffect } from 'react';

export type message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useMessages() {
  const [messages, setMessages] = useState<message[]>([]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('ai-chat-messages');
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
        // If parsing fails, start fresh
        localStorage.removeItem('ai-chat-messages');
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
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
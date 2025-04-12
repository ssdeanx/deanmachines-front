"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { clientMastra } from "@/lib/mastra";

/**
 * Interface for chat message objects
 * @interface ChatMessage
 */
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * The StreamChat component provides a modern, interactive chat interface
 * using client-side streaming for static exports with Mastra integration.
 *
 * @returns {JSX.Element} A chat interface component with streaming capabilities
 */
export default function StreamChat(): JSX.Element {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Auto-grow textarea as user types
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    setPrompt(textarea.value);

    // Auto-resize textarea
    textarea.style.height = "inherit";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  /**
   * Scroll to the bottom of the chat container when messages update
   */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Generate a unique ID for messages
   * @returns {string} A unique ID string
   */
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  /**
   * Process the streaming response from Mastra API
   * @param {ReadableStream} stream - The response stream from the API
   * @param {string} messageId - The ID of the message being updated
   */
  const processStream = async (stream: ReadableStream, messageId: string): Promise<void> => {
    try {
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        try {
          const text = decoder.decode(value, { stream: true });
          accumulatedContent += text;

          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: accumulatedContent }
              : msg
          ));
        } catch (error) {
          console.error("Error decoding stream chunk:", error);
        }
      }
    } catch (error) {
      console.error("Stream processing error:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: msg.content + "\n\n[Error: Connection interrupted]" }
          : msg
      ));
    } finally {
      setIsStreaming(false);
      setCurrentStreamId(null);
    }
  };

  /**
   * Handle form submission to send a message
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!prompt.trim() || isStreaming) return;

    const userMessageId = generateId();
    const assistantMessageId = generateId();

    // Add user message
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: prompt.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add initial assistant message
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: "",
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setPrompt("");
    setIsStreaming(true);
    setCurrentStreamId(assistantMessageId);

    if (inputRef.current) {
      inputRef.current.style.height = "inherit";
    }

    try {
      const stream = await clientMastra.streamChat(prompt.trim());
      await processStream(stream, assistantMessageId);
    } catch (error) {
      console.error("Failed to get chat response:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: "Sorry, I encountered an error while processing your request." }
          : msg
      ));
      setIsStreaming(false);
      setCurrentStreamId(null);
    }
  };

  /**
   * Format the message timestamp
   * @param {Date} date - The timestamp to format
   * @returns {string} Formatted time string
   */
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl shadow-neutral-100/20 dark:shadow-neutral-900/30">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-8-6h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">Mastra AI Assistant</h3>
            <p className="text-xs text-white/80">Powered by Static Export</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`inline-flex h-3 w-3 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-neutral-400'}`}></span>
        </div>
      </div>

      {/* Messages container */}
      <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-neutral-500 dark:text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">Start a conversation</h3>
            <p className="text-sm max-w-xs">Ask about features, pricing, or just chat with Mastra AI</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 backdrop-blur-sm
                  ${message.isUser ?
                    'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20' :
                    'bg-white dark:bg-neutral-800 rounded-tl-none shadow-md shadow-neutral-200/50 dark:shadow-neutral-900/50'
                  }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content || (
                    message.id === currentStreamId && (
                      <div className="flex items-center gap-1 h-6">
                        <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce"></div>
                      </div>
                    )
                  )}
                </div>
                <div className={`text-xs mt-1 ${message.isUser ? 'text-indigo-200' : 'text-neutral-400 dark:text-neutral-500'} text-right`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="flex items-end gap-2">
          <div className="relative flex-grow">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={handleInputChange}
              rows={1}
              placeholder="Type your message..."
              disabled={isStreaming}
              className="w-full resize-none rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 disabled:opacity-70"
              style={{ maxHeight: '200px' }}
            />
            <button
              type="button"
              onClick={() => setPrompt("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-opacity ${prompt ? 'opacity-100' : 'opacity-0'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isStreaming}
            className="rounded-xl bg-indigo-600 disabled:bg-indigo-400 p-3 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isStreaming ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

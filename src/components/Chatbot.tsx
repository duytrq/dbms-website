'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Message = {
  role: 'user' | 'bot'
  text: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi there! I can help you with database stats. Ask me about our revenue, customers, or orders." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      
      const data = await res.json()
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: data.reply || "Sorry, I didn't understand that." 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, there was a network error." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'block'}`}
        aria-label="Open Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Data Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white self-end rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 self-start rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-gray-500 border border-gray-200 self-start rounded-lg rounded-bl-none px-4 py-2 text-sm shadow-sm flex items-center space-x-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about revenue, customers..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

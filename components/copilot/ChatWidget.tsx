'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, History, Plus, Upload, Check, X as XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: any[]
  timestamp: Date
}

interface ChatWidgetProps {
  presentationId?: string
  className?: string
}

export function ChatWidget({ presentationId, className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [threadId, setThreadId] = useState<string>()
  const [mode, setMode] = useState<'agent' | 'chat'>('agent')
  const [showHistory, setShowHistory] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<any[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          threadId,
          presentationId,
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  )
                )
              } else if (data.type === 'tool_calls') {
                // Handle tool calls
                setPendingChanges(prev => [...prev, ...data.tool_calls])
              } else if (data.type === 'tool_result') {
                // Handle tool results
                console.log('Tool executed:', data.result)
              } else if (data.type === 'done') {
                setThreadId(data.threadId)
              }
            } catch (e) {
              // Ignore malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const acceptChanges = () => {
    setPendingChanges([])
    // Trigger page refresh or state update
    window.location.reload()
  }

  const rejectChanges = () => {
    setPendingChanges([])
  }

  const newChat = () => {
    setMessages([])
    setThreadId(undefined)
    setPendingChanges([])
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50",
          "bg-blue-600 hover:bg-blue-700 text-white",
          className
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 w-96 h-[600px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col",
      "max-sm:w-[calc(100vw-24px)] max-sm:h-[calc(100vh-24px)] max-sm:bottom-3 max-sm:right-3",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">
            {threadId ? 'Slide Copilot' : 'New Chat'}
          </h3>
          {pendingChanges.length > 0 && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {pendingChanges.length} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={newChat}
            className="w-8 h-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="w-8 h-8 p-0"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="p-2 border-b">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('agent')}
            className={cn(
              "flex-1 text-xs py-1 px-2 rounded-md transition-colors",
              mode === 'agent' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            )}
          >
            Agent
          </button>
          <button
            onClick={() => setMode('chat')}
            className={cn(
              "flex-1 text-xs py-1 px-2 rounded-md transition-colors",
              mode === 'chat' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            )}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Start a conversation to get help with your slides</p>
              <p className="text-xs mt-1">I can help you edit content, change templates, and optimize your presentation</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-2 text-xs opacity-75">
                      🔧 Used {message.toolCalls.length} tool(s)
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Pending Changes */}
      {pendingChanges.length > 0 && (
        <div className="p-3 border-t bg-orange-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-800">Slides modified</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={acceptChanges}
                className="h-7 px-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-3 h-3 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={rejectChanges}
                className="h-7 px-2"
              >
                <XIcon className="w-3 h-3 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={mode === 'agent' ? "Ask me to help with your slides..." : "Chat about your presentation..."}
              className="min-h-[40px] max-h-32 resize-none pr-10"
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-1 right-1 w-8 h-8 p-0"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

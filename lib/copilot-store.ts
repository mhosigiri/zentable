import { create } from 'zustand'
import { supabase } from './supabase'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tool_calls?: any[]
  created_at: string
}

interface Thread {
  id: string
  title: string
  presentation_id: string
  created_at: string
  updated_at: string
}

interface CopilotState {
  // UI State
  isOpen: boolean
  isMinimized: boolean
  currentThreadId: string | null
  
  // Messages
  messages: Message[]
  isLoading: boolean
  
  // Threads
  threads: Thread[]
  
  // Actions
  setIsOpen: (open: boolean) => void
  setIsMinimized: (minimized: boolean) => void
  setCurrentThreadId: (threadId: string | null) => void
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setIsLoading: (loading: boolean) => void
  loadThreads: (presentationId: string) => Promise<void>
  loadMessages: (threadId: string) => Promise<void>
  createThread: (presentationId: string, title: string) => Promise<string | null>
  deleteThread: (threadId: string) => Promise<void>
  clearMessages: () => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  removeMessage: (messageId: string) => void
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  // Initial state
  isOpen: false,
  isMinimized: false,
  currentThreadId: null,
  messages: [],
  isLoading: false,
  threads: [],

  // Actions
  setIsOpen: (open: boolean) => set({ isOpen: open }),
  setIsMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
  setCurrentThreadId: (threadId: string | null) => set({ currentThreadId: threadId }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setMessages: (messages: Message[]) => set({ messages }),
  clearMessages: () => set({ messages: [] }),

  addMessage: (message: Message) => set(state => ({
    messages: [...state.messages, message],
  })),

  loadThreads: async (presentationId: string) => {
    try {
      const { data, error } = await supabase
        .from('copilot_threads')
        .select('*')
        .eq('presentation_id', presentationId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ threads: data || [] })
    } catch (error) {
      console.error('Failed to load threads:', error)
    }
  },

  loadMessages: async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('copilot_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ messages: data || [] })
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  },

  createThread: async (presentationId: string, title: string) => {
    try {
      const { data, error } = await supabase
        .from('copilot_threads')
        .insert({
          presentation_id: presentationId,
          title: title.substring(0, 100), // Limit title length
        })
        .select()
        .single()

      if (error) throw error
      
      // Reload threads
      await get().loadThreads(presentationId)
      
      return data.id
    } catch (error) {
      console.error('Failed to create thread:', error)
      return null
    }
  },

  deleteThread: async (threadId: string) => {
    try {
      const { error } = await supabase
        .from('copilot_threads')
        .delete()
        .eq('id', threadId)

      if (error) throw error
      
      // Remove from local state
      set(state => ({
        threads: state.threads.filter(t => t.id !== threadId),
        messages: state.currentThreadId === threadId ? [] : state.messages,
        currentThreadId: state.currentThreadId === threadId ? null : state.currentThreadId,
      }))
    } catch (error) {
      console.error('Failed to delete thread:', error)
    }
  },

  // Message utilities
  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }))
  },

  removeMessage: (messageId: string) => {
    set(state => ({
      messages: state.messages.filter(msg => msg.id !== messageId),
    }))
  },
}))

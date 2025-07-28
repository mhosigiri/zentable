-- Step 1.1: Create brainstorming sessions table
CREATE TABLE IF NOT EXISTS public.brainstorming_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_type VARCHAR(50) DEFAULT 'freeform',
    canvas_data JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Step 1.2: Create ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.brainstorming_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(100),
    parent_idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
    position JSONB, -- Canvas position data {"x": 100, "y": 200}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 1.3: Create brainstorming conversations table
CREATE TABLE IF NOT EXISTS public.brainstorming_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.brainstorming_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 1.4: Create brainstorming messages table
CREATE TABLE IF NOT EXISTS public.brainstorming_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.brainstorming_conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    generated_ideas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_brainstorming_sessions_user_id ON public.brainstorming_sessions(user_id);
CREATE INDEX idx_brainstorming_sessions_created_at ON public.brainstorming_sessions(created_at DESC);
CREATE INDEX idx_ideas_session_id ON public.ideas(session_id);
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_ideas_position ON public.ideas(position) WHERE position IS NOT NULL;
CREATE INDEX idx_brainstorming_conversations_session_id ON public.brainstorming_conversations(session_id);
CREATE INDEX idx_brainstorming_messages_conversation_id ON public.brainstorming_messages(conversation_id);
CREATE INDEX idx_brainstorming_messages_created_at ON public.brainstorming_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.brainstorming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brainstorming_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brainstorming_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brainstorming_sessions
CREATE POLICY "Users can view their own brainstorming sessions" ON public.brainstorming_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brainstorming sessions" ON public.brainstorming_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brainstorming sessions" ON public.brainstorming_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brainstorming sessions" ON public.brainstorming_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ideas
CREATE POLICY "Users can view ideas from their sessions" ON public.ideas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create ideas in their sessions" ON public.ideas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" ON public.ideas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" ON public.ideas
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brainstorming_conversations
CREATE POLICY "Users can view their own conversations" ON public.brainstorming_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON public.brainstorming_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for brainstorming_messages
CREATE POLICY "Users can view messages from their conversations" ON public.brainstorming_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.brainstorming_conversations bc
            WHERE bc.id = brainstorming_messages.conversation_id
            AND bc.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their conversations" ON public.brainstorming_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brainstorming_conversations bc
            WHERE bc.id = brainstorming_messages.conversation_id
            AND bc.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_brainstorming_sessions_updated_at BEFORE UPDATE ON public.brainstorming_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
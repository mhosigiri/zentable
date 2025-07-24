# Assistant Approval Flow

## Overview

The AI assistant now supports an approval workflow where users can approve or reject tool calls before they are applied. This ensures users have full control over changes made to their presentations.

## How It Works

### 1. User Requests a Change
When you ask the assistant to make changes (e.g., "Apply the Midnight theme"), the AI will:

1. **Explain what it will do** - The AI explains its plan before taking action
2. **Call the appropriate tool** - The AI calls the tool to make the change
3. **Show approval interface** - You see an approval card with "Apply Changes" and "Reject" buttons
4. **Wait for your decision** - The AI stops and waits for your response

### 2. User Makes a Decision
You have two options:

- **Approve**: Click "Apply Changes" to apply the proposed changes
- **Reject**: Click "Reject" to cancel the changes

### 3. AI Responds Based on Your Decision
After you make your choice:

- **If you approved**: The AI confirms the changes were applied and asks if you need anything else
- **If you rejected**: The AI acknowledges your decision and offers alternative approaches

## Example Flow

```
User: "Apply the Midnight theme to my presentation"

Assistant: "I'll apply the Midnight theme to your presentation. This will give your slides a dark, professional look with deep blues and blacks, perfect for a sophisticated presentation."

[AI calls applyTheme tool - shows approval card]

User: [Clicks "Apply Changes"]

Assistant: "Great! The Midnight theme has been applied successfully. Your presentation now has a dark, professional appearance. Is there anything else you'd like me to help you with?"

User: "I rejected the theme change"

Assistant: "I understand you didn't want the Midnight theme applied. What would you prefer instead? I can suggest other themes or help you with something else entirely."
```

## Supported Tools

The approval flow works with these tools:

- **applyTheme** - Changing presentation themes
- **updateSlideContent** - Modifying slide content
- **createSlide** - Creating new slides
- **deleteSlide** - Deleting slides
- **duplicateSlide** - Duplicating slides
- **moveSlide** - Moving slides
- **changeSlideTemplate** - Changing slide templates
- **updateSlideImage** - Updating slide images

## Benefits

- **User Control**: You decide what changes are applied
- **Transparency**: You see exactly what the AI wants to change
- **Safety**: No unexpected modifications to your presentation
- **Flexibility**: You can reject changes and ask for alternatives

## Technical Implementation

The approval flow uses:

1. **Tool Result Component** (`ToolResult`) - Displays approval interface
2. **Custom Events** - Communicates user decisions to the chat system
3. **System Prompt Updates** - Instructs AI on how to handle user decisions
4. **Message Routing** - Sends user decisions as messages to the AI

This ensures a smooth, conversational experience where the AI respects your decisions and responds appropriately. 
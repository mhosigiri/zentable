# Human-in-the-Loop (HITL) Implementation for Cursor for Slides

## Overview

This implementation adds human-in-the-loop functionality to the Cursor for Slides project, allowing users to approve or deny AI tool executions before they happen. The AI will wait for user confirmation and then continue with a final response after tool execution.

## How It Works

### 1. **Tool Classification**
- **Tools WITHOUT `execute` functions**: Require human approval (HITL)
- **Tools WITH `execute` functions**: Run automatically

### 2. **HITL Flow**
1. User sends a message to the AI
2. AI decides to call a tool that requires approval
3. Frontend shows approval UI with tool details
4. User clicks "Approve" or "Deny"
5. Tool result is sent back to the server
6. Server processes the approval/denial and executes the tool if approved
7. AI continues with a final response based on the tool result

## Implementation Files

### Core Files

#### `lib/ai/slide-tools.ts`
- **Purpose**: Defines all available tools
- **Key Changes**: 
  - Tools that need approval have NO `execute` function
  - Tools that run automatically have an `execute` function
  - Added `APPROVAL` constants for Yes/No responses

```typescript
// HITL: This tool requires human approval - NO execute function
export const updateSlideContent = tool({
  description: 'Update the content of a slide with new HTML content. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to update'),
    content: z.string().describe('The new HTML content for the slide'),
  }),
  // NO execute function - requires human approval
});

// This tool runs automatically - has execute function
export const getSlideIdByNumber = tool({
  description: "Get the ID of a slide by its number in the presentation",
  inputSchema: z.object({
    presentationId: z.string().describe("The ID of the presentation"),
    slideNumber: z.number().describe("The number of the slide (1-based index)"),
  }),
  execute: async ({ presentationId, slideNumber }) => {
    // Tool logic here
  },
});
```

#### `lib/ai/hitl-utils.ts`
- **Purpose**: Utility functions for processing HITL tool calls
- **Key Functions**:
  - `processToolCalls()`: Processes pending tool confirmations
  - `getToolsRequiringConfirmation()`: Identifies tools that need approval
  - `slideExecuteFunctions`: Contains the actual execution logic for approved tools

#### `lib/ai/hitl-types.ts`
- **Purpose**: TypeScript type definitions for HITL messages
- **Key Types**:
  - `HumanInTheLoopUIMessage`: Custom message type with tool schemas
  - `SlideTools`: Inferred tool types from slide tools

#### `app/api/assistant-chat-simple/route.ts`
- **Purpose**: Simplified API route that works with HITL
- **Key Features**:
  - Uses `createUIMessageStream` for HITL processing
  - Processes tool confirmations before continuing
  - Maintains compatibility with existing chat system

#### `components/assistant-ui/hitl-chat.tsx`
- **Purpose**: React component that renders the HITL chat interface
- **Key Features**:
  - Shows approval UI for tools that need confirmation
  - Disables input when approval is pending
  - Renders tool execution status
  - Handles approve/deny actions

#### `app/test-hitl/page.tsx`
- **Purpose**: Test page to demonstrate HITL functionality
- **Usage**: Navigate to `/test-hitl` to test the system

## Tools That Require Approval (HITL)

The following tools require user approval before execution:

1. **`updateSlideContent`** - Modify slide content
2. **`createSlide`** - Create new slides
3. **`deleteSlide`** - Delete slides
4. **`duplicateSlide`** - Duplicate slides
5. **`moveSlide`** - Move slides to different positions
6. **`changeSlideTemplate`** - Change slide templates
7. **`updateSlideImage`** - Generate or update slide images
8. **`applyTheme`** - Apply themes to presentations

## Tools That Run Automatically

The following tools run automatically without approval:

1. **`getSlideContent`** - View slide content (read-only)
2. **`getSlideIdByNumber`** - Get slide ID by number (utility)

## Usage Examples

### Example 1: Updating Slide Content
```
User: "Update slide 1 with better bullet points"

AI: "I'll help you improve the bullet points on slide 1. Let me first get the slide ID and then update the content with more engaging and professional bullet points."

[Tool call: getSlideIdByNumber] ✅ (runs automatically)
[Tool call: updateSlideContent] ⏳ (requires approval)

Frontend shows:
┌─────────────────────────────────────┐
│ Tool Approval Required:              │
│ Run updateSlideContent with args:   │
│ {                                    │
│   "slideId": "slide-123",           │
│   "content": "<h1>Improved Title</h1>..." │
│ }                                    │
│ [✅ Approve] [❌ Deny]               │
└─────────────────────────────────────┘

User clicks "Approve"

AI: "Perfect! I've successfully updated Slide 1 with improved bullet points. The content is now more engaging and professional. Is there anything else you'd like me to help you with?"
```

### Example 2: Creating a New Slide
```
User: "Create a new slide about market analysis"

AI: "I'll create a new slide focused on market analysis for your presentation."

[Tool call: createSlide] ⏳ (requires approval)

Frontend shows:
┌─────────────────────────────────────┐
│ Tool Approval Required:              │
│ Run createSlide with args:          │
│ {                                    │
│   "presentationId": "pres-456",     │
│   "templateType": "bullets",        │
│   "title": "Market Analysis",       │
│   "content": "Market overview..."   │
│ }                                    │
│ [✅ Approve] [❌ Deny]               │
└─────────────────────────────────────┘

User clicks "Approve"

AI: "Excellent! I've created a new slide titled 'Market Analysis' using the bullets template. The slide has been added to your presentation and includes key market insights. Would you like me to add any specific data points or modify the content?"
```

## Testing the Implementation

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Navigate to Test Page**
Go to `http://localhost:3000/test-hitl`

### 3. **Test Commands**
Try these commands in the chat:

- **Content Updates**: "Update slide 1 with better bullet points"
- **Slide Creation**: "Create a new slide about market analysis"
- **Slide Deletion**: "Delete slide 2"
- **Theme Changes**: "Apply a modern theme to the presentation"
- **Image Generation**: "Add an image to slide 1 showing data visualization"

### 4. **Expected Behavior**
- Tools that need approval will show an approval UI
- Tools that run automatically will execute immediately
- The AI will always provide a final response after tool execution
- The input field will be disabled when approval is pending

## Integration with Existing System

### 1. **Replace Existing Chat Component**
To use HITL in your existing chat interface, replace the current chat component with `HITLChat`:

```typescript
import { HITLChat } from '@/components/assistant-ui/hitl-chat';

// In your component
<HITLChat 
  presentationId={presentationId}
  className="your-custom-classes"
/>
```

### 2. **Update API Route**
The simplified route (`/api/assistant-chat-simple`) is ready to use. For production, you can:

1. Fix the type issues in the main route (`/api/assistant-chat`)
2. Or use the simplified route as-is

### 3. **Customize Tool Execution**
To customize how tools execute after approval, modify the `slideExecuteFunctions` in `lib/ai/hitl-utils.ts`.

## Key Benefits

1. **User Control**: Users have full control over AI actions
2. **Transparency**: Users can see exactly what the AI wants to do
3. **Safety**: Prevents unwanted changes to presentations
4. **Continuity**: AI continues with helpful responses after tool execution
5. **Flexibility**: Easy to add new tools that require approval

## Troubleshooting

### Common Issues

1. **Tool not showing approval UI**
   - Check that the tool has NO `execute` function in `slide-tools.ts`
   - Verify the tool is included in `getToolsRequiringConfirmation()`

2. **Approval not working**
   - Check that `addToolResult()` is called with correct parameters
   - Verify the `APPROVAL.YES` and `APPROVAL.NO` constants match

3. **AI not continuing after tool execution**
   - Check the system prompt includes instructions to continue after tool calls
   - Verify the tool result is properly formatted

### Debug Mode
Enable debug logging by checking the browser console and server logs for detailed information about tool calls and approvals.

## Future Enhancements

1. **Custom Approval UI**: Create more sophisticated approval interfaces
2. **Batch Approvals**: Allow approving multiple tool calls at once
3. **Approval History**: Track and display approval history
4. **Conditional Approvals**: Auto-approve certain types of changes
5. **Approval Workflows**: Multi-step approval processes for complex operations

## Conclusion

This HITL implementation provides a robust foundation for user-controlled AI interactions in the Cursor for Slides project. The system is designed to be:

- **User-friendly**: Clear approval interfaces
- **Safe**: No unwanted changes without approval
- **Flexible**: Easy to extend with new tools
- **Maintainable**: Clean separation of concerns

The implementation follows the Vercel AI SDK patterns and integrates seamlessly with the existing codebase.


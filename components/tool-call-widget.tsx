'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  Trash2, 
  FileEdit, 
  Image,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolCall {
  name: string
  args: any
  id: string
}

interface ToolCallWidgetProps {
  toolCall: ToolCall
  result?: any
  className?: string
}

const getToolIcon = (toolName: string) => {
  switch (toolName) {
    case 'updateSlideContent':
      return FileEdit
    case 'updateSlideProperty':
      return FileEdit
    case 'addBulletToProperty':
      return Plus
    case 'deleteSlide':
      return Trash2
    case 'updateSlideImage':
      return Image
    case 'changeSlideTemplate':
      return Settings
    default:
      return Settings
  }
}

const getToolDisplayName = (toolName: string) => {
  switch (toolName) {
    case 'updateSlideContent':
      return 'Update Slide Content'
    case 'updateSlideProperty':
      return 'Update Slide'
    case 'addBulletToProperty':
      return 'Add Bullet Point'
    case 'deleteSlide':
      return 'Delete Slide'
    case 'updateSlideImage':
      return 'Update Image'
    case 'changeSlideTemplate':
      return 'Change Template'
    default:
      return toolName
  }
}

const formatToolArgs = (toolName: string, args: any) => {
  switch (toolName) {
    case 'updateSlideContent':
      return `Updating slide content: ${args.slideId}`
    case 'updateSlideProperty':
      return `${args.property}: "${args.value}"`
    case 'addBulletToProperty':
      return `Added: "${args.bullet}" ${args.position !== undefined ? `at position ${args.position}` : ''}`
    case 'deleteSlide':
      return `Slide ID: ${args.slideId}`
    case 'updateSlideImage':
      return args.imageUrl ? `New image URL` : args.imagePrompt ? `New prompt: "${args.imagePrompt}"` : 'Image updated'
    case 'changeSlideTemplate':
      return `Template: ${args.newTemplate}`
    default:
      return JSON.stringify(args, null, 2).slice(0, 100) + '...'
  }
}

const getResultStatus = (result: any) => {
  if (!result) return 'pending'
  if (result.error) return 'error'
  if (result.success) return 'success'
  return 'complete'
}

const getResultMessage = (toolName: string, result: any) => {
  if (!result) return 'Processing...'
  if (result.error) return result.error
  if (result.message) return result.message
  if (result.success) return 'Operation completed successfully'
  return 'Completed'
}

export function ToolCallWidget({ toolCall, result, className }: ToolCallWidgetProps) {
  const Icon = getToolIcon(toolCall.name)
  const status = getResultStatus(result)
  const displayName = getToolDisplayName(toolCall.name)
  const argsText = formatToolArgs(toolCall.name, toolCall.args)
  const resultMessage = getResultMessage(toolCall.name, result)

  return (
    <Card className={cn(
      "p-3 border-l-4 bg-blue-50/50",
      status === 'success' && "border-l-green-500 bg-green-50/50",
      status === 'error' && "border-l-red-500 bg-red-50/50",
      status === 'pending' && "border-l-blue-500",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 p-2 rounded-full",
          status === 'success' && "bg-green-100 text-green-600",
          status === 'error' && "bg-red-100 text-red-600",
          status === 'pending' && "bg-blue-100 text-blue-600"
        )}>
          {status === 'pending' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900">
              {displayName}
            </h4>
            <Badge 
              variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {status === 'pending' ? 'Running' : status === 'success' ? 'Success' : status === 'error' ? 'Error' : 'Done'}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 mb-2 font-mono bg-gray-100 px-2 py-1 rounded">
            {argsText}
          </p>
          
          <div className="flex items-start gap-2">
            {status === 'success' && <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />}
            {status === 'pending' && <Loader2 className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />}
            
            <p className={cn(
              "text-xs",
              status === 'success' && "text-green-700",
              status === 'error' && "text-red-700",
              status === 'pending' && "text-blue-700"
            )}>
              {resultMessage}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

import { InferUITools, UIDataTypes, UIMessage } from 'ai';
import { slideTools } from './slide-tools';

export type SlideTools = InferUITools<typeof slideTools>;

// Define custom message type with tool part schemas for type safety
export type HumanInTheLoopUIMessage = UIMessage<
  never, // metadata type
  UIDataTypes, // data parts type
  SlideTools // tools type
>;


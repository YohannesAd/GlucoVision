/**
 * Chat Service Exports
 * ====================
 * 
 * Central export point for chat-related services and types.
 */

export { chatService, default as ChatService } from './chatService';
export type { 
  ChatMessage, 
  Conversation, 
  ChatResponse, 
  ConversationsResponse, 
  ChatHistoryResponse 
} from './chatService';

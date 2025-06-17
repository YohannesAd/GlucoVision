/**
 * GlucoVision Chat Hook
 * =====================
 * 
 * Professional React hook for AI chat functionality.
 * Manages chat state, message sending, and conversation history.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { chatService, ChatMessage, Conversation } from '../services/chat/chatService';
import { useAppState } from './useAppState';

interface UseChatState {
  messages: ChatMessage[];
  conversations: Conversation[];
  isLoading: boolean;
  isTyping: boolean;
  conversationId: string | null;
  error: string | null;
}

interface UseChatActions {
  sendMessage: (message: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadConversationHistory: (conversationId: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  startNewConversation: () => void;
}

interface UseChatReturn {
  state: UseChatState;
  actions: UseChatActions;
}

export function useChat(): UseChatReturn {
  const { auth } = useAppState();
  
  // State management
  const [state, setState] = useState<UseChatState>({
    messages: [],
    conversations: [],
    isLoading: false,
    isTyping: false,
    conversationId: null,
    error: null
  });

  // Refs for managing state updates
  const isUnmountedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // Safe state update helper
  const safeSetState = useCallback((updater: (prev: UseChatState) => UseChatState) => {
    if (!isUnmountedRef.current) {
      setState(updater);
    }
  }, []);

  // Send message action
  const sendMessage = useCallback(async (messageText: string) => {
    if (!auth?.state?.token) {
      Alert.alert('Authentication Error', 'Please log in to use chat');
      return;
    }

    // Validate message
    const validation = chatService.validateMessage(messageText);
    if (!validation.isValid) {
      Alert.alert('Invalid Message', validation.error || 'Please enter a valid message');
      return;
    }

    // Check for urgent keywords
    if (chatService.containsUrgentKeywords(messageText)) {
      Alert.alert(
        'Medical Emergency',
        'If this is a medical emergency, please call 911 or contact your healthcare provider immediately.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => proceedWithMessage(messageText) }
        ]
      );
      return;
    }

    await proceedWithMessage(messageText);
  }, [auth?.state?.token]);

  // Proceed with sending message
  const proceedWithMessage = useCallback(async (messageText: string) => {
    if (!auth?.state?.token) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      conversation_id: state.conversationId || '',
      message_type: 'user',
      content: messageText.trim(),
      created_at: new Date().toISOString()
    };

    // Add user message to state
    safeSetState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      isTyping: true,
      error: null
    }));

    try {
      // Send message to API
      const response = await chatService.sendMessage(
        messageText,
        state.conversationId,
        auth.state.token
      );

      if (response.success && response.data) {
        const aiMessage = chatService.formatMessage(response.data);
        
        safeSetState(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          conversationId: aiMessage.conversation_id,
          isLoading: false,
          isTyping: false
        }));
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        conversation_id: state.conversationId || '',
        message_type: 'ai',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        created_at: new Date().toISOString(),
        ai_confidence: 0.5
      };

      safeSetState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        isTyping: false,
        error: 'Failed to send message. Please try again.'
      }));

      Alert.alert(
        'Connection Error',
        'Unable to send message. Please check your connection and try again.'
      );
    }
  }, [auth?.state?.token, state.conversationId, safeSetState]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!auth?.state?.token) return;

    safeSetState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await chatService.getConversations(auth.state.token);
      
      if (response.success && response.data) {
        safeSetState(prev => ({
          ...prev,
          conversations: response.data || [],
          isLoading: false
        }));
      } else {
        throw new Error(response.error || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Load conversations error:', error);
      safeSetState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load conversations'
      }));
    }
  }, [auth?.state?.token, safeSetState]);

  // Load conversation history
  const loadConversationHistory = useCallback(async (conversationId: string) => {
    if (!auth?.state?.token) return;

    safeSetState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await chatService.getConversationHistory(
        conversationId,
        auth.state.token
      );
      
      if (response.success && response.data) {
        const formattedMessages = response.data.messages.map(msg => 
          chatService.formatMessage(msg)
        );
        
        safeSetState(prev => ({
          ...prev,
          messages: formattedMessages,
          conversationId: conversationId,
          isLoading: false
        }));
      } else {
        throw new Error(response.error || 'Failed to load conversation history');
      }
    } catch (error) {
      console.error('Load conversation history error:', error);
      safeSetState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load conversation history'
      }));
    }
  }, [auth?.state?.token, safeSetState]);

  // Clear messages
  const clearMessages = useCallback(() => {
    safeSetState(prev => ({
      ...prev,
      messages: [],
      conversationId: null,
      error: null
    }));
  }, [safeSetState]);

  // Clear error
  const clearError = useCallback(() => {
    safeSetState(prev => ({ ...prev, error: null }));
  }, [safeSetState]);

  // Start new conversation
  const startNewConversation = useCallback(() => {
    safeSetState(prev => ({
      ...prev,
      messages: [],
      conversationId: null,
      error: null
    }));
  }, [safeSetState]);

  return {
    state,
    actions: {
      sendMessage,
      loadConversations,
      loadConversationHistory,
      clearMessages,
      clearError,
      startNewConversation
    }
  };
}

export default useChat;

/**
 * GlucoVision Chat Service
 * ========================
 * 
 * Professional chat service for AI diabetes conversations.
 * Handles message sending, conversation management, and history.
 */

import { API_BASE_URL } from '../api/config';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  message_type: 'user' | 'ai';
  content: string;
  ai_confidence?: number;
  medical_topics?: string[];
  recommendations?: string[];
  created_at: string;
}

export interface Conversation {
  id: string;
  title?: string;
  message_count: number;
  last_message_at?: string;
  created_at: string;
}

export interface ChatResponse {
  success: boolean;
  data?: ChatMessage;
  error?: string;
}

export interface ConversationsResponse {
  success: boolean;
  data?: Conversation[];
  error?: string;
}

export interface ChatHistoryResponse {
  success: boolean;
  data?: {
    conversation_id: string;
    messages: ChatMessage[];
    has_more: boolean;
    total_messages: number;
  };
  error?: string;
}

class ChatService {
  /**
   * Send a chat message to AI
   */
  async sendMessage(
    message: string,
    conversationId: string | null,
    token: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat message error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to send message: ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.'
      };
    }
  }

  /**
   * Get user's conversation list
   */
  async getConversations(token: string, limit: number = 20): Promise<ConversationsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/ai/conversations?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get conversations error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to fetch conversations: ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get conversations service error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.'
      };
    }
  }

  /**
   * Get conversation message history
   */
  async getConversationHistory(
    conversationId: string,
    token: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatHistoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/ai/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get conversation history error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to fetch conversation history: ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get conversation history service error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.'
      };
    }
  }

  /**
   * Format message for display
   */
  formatMessage(message: ChatMessage): ChatMessage {
    return {
      ...message,
      content: message.content.trim(),
      created_at: message.created_at || new Date().toISOString()
    };
  }

  /**
   * Validate message before sending
   */
  validateMessage(message: string): { isValid: boolean; error?: string } {
    const trimmed = message.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'Message cannot be empty' };
    }
    
    if (trimmed.length > 2000) {
      return { isValid: false, error: 'Message is too long (max 2000 characters)' };
    }
    
    return { isValid: true };
  }

  /**
   * Get quick suggestion questions for diabetes
   */
  getQuickSuggestions(): Array<{ id: string; text: string; query: string }> {
    return [
      {
        id: '1',
        text: '📊 Analyze my readings',
        query: 'Can you analyze my recent glucose readings and tell me what patterns you see?'
      },
      {
        id: '2',
        text: '🎯 Target ranges',
        query: 'What should my target glucose range be and how am I doing?'
      },
      {
        id: '3',
        text: '🍽️ Diet advice',
        query: 'What foods should I eat to better manage my blood sugar levels?'
      },
      {
        id: '4',
        text: '🏃 Exercise impact',
        query: 'How does exercise affect my blood sugar and when should I exercise?'
      },
      {
        id: '5',
        text: '💊 Medications',
        query: 'Tell me about diabetes medications and how they work'
      },
      {
        id: '6',
        text: '⚠️ Warning signs',
        query: 'What are the warning signs of high or low blood sugar I should watch for?'
      },
      {
        id: '7',
        text: '📈 Trends',
        query: 'What trends do you see in my glucose data over time?'
      },
      {
        id: '8',
        text: '🌙 Sleep & glucose',
        query: 'How does sleep affect my blood sugar levels?'
      }
    ];
  }

  /**
   * Extract medical topics from AI response
   */
  extractMedicalTopics(message: ChatMessage): string[] {
    return message.medical_topics || [];
  }

  /**
   * Get confidence level description
   */
  getConfidenceDescription(confidence?: number): string {
    if (!confidence) return 'Unknown';
    
    const percent = Math.round(confidence * 100);
    
    if (percent >= 90) return 'Very High';
    if (percent >= 80) return 'High';
    if (percent >= 70) return 'Good';
    if (percent >= 60) return 'Moderate';
    return 'Low';
  }

  /**
   * Check if message contains urgent medical keywords
   */
  containsUrgentKeywords(message: string): boolean {
    const urgentKeywords = [
      'emergency', 'urgent', 'severe', 'chest pain', 'difficulty breathing',
      'unconscious', 'seizure', 'very high', 'very low', 'ketoacidosis',
      'hospital', 'ambulance', '911'
    ];
    
    const lowerMessage = message.toLowerCase();
    return urgentKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Get medical disclaimer text
   */
  getMedicalDisclaimer(): string {
    return '⚠️ This AI provides general diabetes information only. Always consult your healthcare provider for medical decisions.';
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;

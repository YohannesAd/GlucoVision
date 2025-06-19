import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView,
  Platform, TextInput, Animated
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer, Button
} from '../../components/ui';
import { useChat } from '../../hooks';
import { chatService, ChatMessage } from '../../services/chat/chatService';

/**
 * AIChatScreen - Intelligent diabetes chat assistant
 * Professional AI chat interface for diabetes management
 */

type AIChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AIChat'>;

interface AIChatScreenProps {
  navigation: AIChatScreenNavigationProp;
}



export default function AIChatScreen({ navigation }: AIChatScreenProps) {
  const { state: chatState, actions: chatActions } = useChat();

  // Local state
  const [inputMessage, setInputMessage] = useState('');

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Get quick suggestions from service
  const quickSuggestions = chatService.getQuickSuggestions();

  // Initialize chat with welcome message
  useEffect(() => {
    if (chatState.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        conversation_id: '',
        message_type: 'ai',
        content: `Hello! 👋 I'm your diabetes management AI assistant. I can help you understand your glucose patterns, answer questions about diabetes care, and provide general guidance.\n\nWhat would you like to know today?`,
        created_at: new Date().toISOString(),
        ai_confidence: 1.0
      };
      // We'll add this to the local display only, not send to backend
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatState.messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || chatState.isLoading) return;

    setInputMessage('');
    await chatActions.sendMessage(messageText.trim());
  };

  const handleQuickSuggestion = (suggestion: { id: string; text: string; query: string }) => {
    sendMessage(suggestion.query);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.message_type === 'user';

    return (
      <View
        key={message.id}
        className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
      >
        <View
          className={`max-w-[80%] p-4 rounded-2xl ${
            isUser
              ? 'bg-blue-500 rounded-br-md'
              : 'bg-gray-100 rounded-bl-md'
          }`}
        >
          <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {message.content}
          </Text>

          {/* AI confidence and topics */}
          {!isUser && message.ai_confidence && (
            <View className="mt-2 pt-2 border-t border-gray-200">
              {message.medical_topics && message.medical_topics.length > 0 && (
                <View className="flex-row flex-wrap mb-1">
                  {message.medical_topics.map((topic, index) => (
                    <View key={index} className="bg-blue-100 px-2 py-1 rounded-full mr-1 mb-1">
                      <Text className="text-xs text-blue-700 capitalize">
                        {topic.replace('_', ' ')}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <Text className="text-xs text-gray-500">
                Confidence: {Math.round((message.ai_confidence || 0) * 100)}%
              </Text>
            </View>
          )}
        </View>

        <Text className="text-xs text-gray-400 mt-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    );
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      const animateDots = () => {
        const createAnimation = (dot: Animated.Value, delay: number) => {
          return Animated.loop(
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(dot, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0.3,
                duration: 400,
                useNativeDriver: true,
              }),
            ])
          );
        };

        Animated.parallel([
          createAnimation(dot1, 0),
          createAnimation(dot2, 200),
          createAnimation(dot3, 400),
        ]).start();
      };

      if (chatState.isTyping) {
        animateDots();
      }
    }, [chatState.isTyping, dot1, dot2, dot3]);

    if (!chatState.isTyping) return null;

    return (
      <View className="items-start mb-4">
        <View className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
          <View className="flex-row items-center">
            <View className="flex-row space-x-1">
              <Animated.View
                className="w-2 h-2 bg-gray-400 rounded-full"
                style={{ opacity: dot1 }}
              />
              <Animated.View
                className="w-2 h-2 bg-gray-400 rounded-full"
                style={{ opacity: dot2 }}
              />
              <Animated.View
                className="w-2 h-2 bg-gray-400 rounded-full"
                style={{ opacity: dot3 }}
              />
            </View>
            <Text className="ml-2 text-gray-500 text-sm">AI is thinking...</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer backgroundColor="bg-white">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Text className="text-darkBlue text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkBlue">AI Chat</Text>
          <View className="w-8" />
        </View>
      </View>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome message */}
          {chatState.messages.length === 0 && (
            <View className="items-start mb-4">
              <View className="bg-gray-100 p-4 rounded-2xl rounded-bl-md max-w-[80%]">
                <Text className="text-base text-gray-800">
                  Hello! 👋 I'm your diabetes management AI assistant. I can help you understand your glucose patterns, answer questions about diabetes care, and provide general guidance.{'\n\n'}What would you like to know today?
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

          {chatState.messages.map(renderMessage)}
          <TypingIndicator />
        </ScrollView>

        {/* Quick Suggestions */}
        {chatState.messages.length === 0 && (
          <View className="px-4 py-2">
            <Text className="text-sm text-gray-600 mb-2">Quick questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {quickSuggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.id}
                    onPress={() => handleQuickSuggestion(suggestion)}
                    className="bg-blue-50 px-3 py-2 rounded-full border border-blue-200"
                    disabled={chatState.isLoading}
                  >
                    <Text className="text-blue-700 text-sm">{suggestion.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Input Area - ChatGPT Style */}
        <View className="px-4 py-3 bg-white border-t border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-4 min-h-[52px]">
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Message GlucoVision AI..."
              placeholderTextColor="#6B7280"
              multiline
              maxLength={500}
              editable={!chatState.isLoading}
              className="flex-1 text-base text-gray-900 max-h-24"
              style={{
                textAlignVertical: 'center',
                paddingTop: 8,
                paddingBottom: 8,
                paddingRight: 16,
                paddingLeft: 0,
                lineHeight: 22,
                fontSize: 16,
                color: '#111827',
                minHeight: 22
              }}
            />

            <TouchableOpacity
              onPress={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || chatState.isLoading}
              className={`w-8 h-8 rounded-full items-center justify-center ml-2 ${
                inputMessage.trim() && !chatState.isLoading
                  ? 'bg-blue-500'
                  : 'bg-gray-400'
              }`}
            >
              <Text className="text-white text-lg font-bold">
                {chatState.isLoading ? '⋯' : '↑'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-500 mt-2 text-center">
            ⚠️ This AI provides general diabetes information only. Always consult your healthcare provider.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

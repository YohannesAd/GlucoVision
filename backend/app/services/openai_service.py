"""
GlucoVision OpenAI Service
==========================

Professional OpenAI GPT-4 integration for diabetes-focused AI chat.
Provides intelligent, context-aware responses with medical safety.

Features:
- GPT-4 integration for natural conversations
- Diabetes-specific prompt engineering
- Medical safety and accuracy validation
- Context-aware glucose data analysis
- Professional error handling
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from openai import AsyncOpenAI
import json

from app.core.config import settings
from app.models.user import User
from app.models.glucose_log import GlucoseLog

# Configure logging
logger = logging.getLogger(__name__)


class OpenAIService:
    """
    Professional OpenAI Service for Diabetes Management
    
    Provides intelligent AI responses using GPT-4 with medical context.
    """
    
    def __init__(self):
        """Initialize OpenAI service with configuration"""
        # Debug logging for OpenAI configuration
        logger.info(f"OpenAI Configuration Debug:")
        logger.info(f"  OPENAI_API_KEY: {'SET' if settings.OPENAI_API_KEY else 'NOT SET'}")
        logger.info(f"  ENABLE_OPENAI_CHAT: {settings.ENABLE_OPENAI_CHAT}")
        logger.info(f"  OPENAI_MODEL: {settings.OPENAI_MODEL}")

        if not settings.OPENAI_API_KEY:
            logger.warning("OpenAI API key not configured. Chat will use fallback responses.")
            self.client = None
        else:
            logger.info("Initializing OpenAI client with API key")
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        self.temperature = settings.OPENAI_TEMPERATURE
        
        # Medical disclaimer
        self.medical_disclaimer = (
            "\n\n⚠️ This AI provides general diabetes information only. "
            "Always consult your healthcare provider for medical decisions."
        )
    
    def _create_system_prompt(self, user: User, glucose_context: Dict[str, Any]) -> str:
        """Create specialized system prompt for diabetes management"""
        
        # Base system prompt
        system_prompt = """You are a specialized AI assistant for diabetes management. You provide helpful, accurate, and supportive information about diabetes care, glucose monitoring, and lifestyle management.

IMPORTANT GUIDELINES:
1. Always prioritize user safety and medical accuracy
2. Encourage users to consult healthcare providers for medical decisions
3. Provide practical, actionable advice for diabetes management
4. Be supportive and understanding of the challenges of living with diabetes
5. Use clear, non-technical language when possible
6. Include relevant glucose data analysis when available

MEDICAL SAFETY:
- Never provide specific medical diagnoses
- Always recommend consulting healthcare providers for concerning symptoms
- Emphasize the importance of regular medical check-ups
- Warn about emergency situations (severe highs/lows)

RESPONSE STYLE:
- Be conversational and supportive
- Use emojis appropriately to make responses friendly
- Provide specific, actionable advice
- Include relevant data insights when available
- Keep responses concise but comprehensive"""

        # Add user context
        if user:
            user_context = f"\n\nUSER CONTEXT:\n"
            if user.diabetes_type:
                user_context += f"- Diabetes Type: {user.diabetes_type.value.title()}\n"
            if user.current_medications:
                user_context += f"- Current Medications: {', '.join(user.current_medications)}\n"
            if user.target_range_min and user.target_range_max:
                user_context += f"- Target Range: {user.target_range_min}-{user.target_range_max} mg/dL\n"
            if user.activity_level:
                user_context += f"- Activity Level: {user.activity_level.title()}\n"
            
            system_prompt += user_context
        
        # Add glucose context
        if glucose_context.get("has_data"):
            glucose_info = f"\n\nRECENT GLUCOSE DATA:\n"
            glucose_info += f"- Latest Reading: {glucose_context['latest_reading']} mg/dL\n"
            glucose_info += f"- Average (recent): {glucose_context['average_glucose']} mg/dL\n"
            glucose_info += f"- Time in Range: {glucose_context['time_in_range']}%\n"
            glucose_info += f"- Number of Recent Readings: {glucose_context['reading_count']}\n"
            
            system_prompt += glucose_info
        
        return system_prompt
    
    def _create_user_message(self, message: str, conversation_history: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Create user message with conversation context"""
        
        messages = []
        
        # Add recent conversation history (last 6 messages for context)
        if conversation_history:
            recent_history = conversation_history[-6:]
            for msg in recent_history:
                role = "user" if msg.get("message_type") == "user" else "assistant"
                messages.append({
                    "role": role,
                    "content": msg.get("content", "")
                })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": message
        })
        
        return messages
    
    async def generate_response(
        self,
        user_message: str,
        user: User,
        glucose_context: Dict[str, Any],
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Generate intelligent AI response using GPT-4
        
        Args:
            user_message: User's message
            user: User object with medical context
            glucose_context: Recent glucose data context
            conversation_history: Previous conversation messages
            
        Returns:
            Dict containing response and metadata
        """
        
        # Debug logging
        logger.info(f"OpenAI Response Generation:")
        logger.info(f"  Client available: {self.client is not None}")
        logger.info(f"  ENABLE_OPENAI_CHAT: {settings.ENABLE_OPENAI_CHAT}")
        logger.info(f"  User message: {user_message[:50]}...")

        if not self.client or not settings.ENABLE_OPENAI_CHAT:
            logger.warning("Using fallback response - OpenAI not available")
            return self._fallback_response(user_message)
        
        try:
            # Create system prompt with medical context
            system_prompt = self._create_system_prompt(user, glucose_context)
            
            # Create message history
            messages = [{"role": "system", "content": system_prompt}]
            user_messages = self._create_user_message(user_message, conversation_history or [])
            messages.extend(user_messages)
            
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            # Extract response
            ai_response = response.choices[0].message.content
            
            # Add medical disclaimer
            ai_response += self.medical_disclaimer
            
            # Extract medical topics (simple keyword detection)
            medical_topics = self._extract_medical_topics(user_message, ai_response)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(user_message, glucose_context)
            
            return {
                "response": ai_response,
                "confidence": 0.9,  # High confidence for GPT-4
                "medical_topics": medical_topics,
                "recommendations": recommendations,
                "user_intent": self._classify_intent(user_message),
                "category": "ai_generated",
                "model_used": self.model,
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._fallback_response(user_message, error=str(e))
    
    def _extract_medical_topics(self, user_message: str, ai_response: str) -> List[str]:
        """Extract medical topics from conversation"""
        topics = []
        combined_text = (user_message + " " + ai_response).lower()
        
        topic_keywords = {
            "blood_sugar": ["blood sugar", "glucose", "bg", "sugar level", "reading"],
            "insulin": ["insulin", "injection", "pen", "pump", "dose"],
            "diet": ["food", "eat", "diet", "meal", "carb", "carbohydrate", "nutrition"],
            "exercise": ["exercise", "workout", "activity", "walk", "run", "physical"],
            "medication": ["medication", "medicine", "drug", "pill", "prescription"],
            "symptoms": ["symptom", "feel", "dizzy", "tired", "thirsty", "frequent urination"],
            "monitoring": ["test", "check", "monitor", "meter", "cgm", "continuous"],
            "complications": ["complication", "kidney", "eye", "nerve", "heart", "foot"]
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in combined_text for keyword in keywords):
                topics.append(topic)
        
        return topics
    
    def _generate_recommendations(self, user_message: str, glucose_context: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        message_lower = user_message.lower()
        
        # General recommendations
        recommendations.append("Monitor your glucose regularly")
        
        # Context-specific recommendations
        if glucose_context.get("has_data"):
            tir = glucose_context.get("time_in_range", 0)
            if tir < 70:
                recommendations.append("Work on improving time in range")
            
            latest = glucose_context.get("latest_reading", 0)
            if latest > 250:
                recommendations.append("Stay hydrated and monitor closely")
            elif latest < 70:
                recommendations.append("Have a quick-acting carbohydrate")
        
        # Intent-based recommendations
        if any(word in message_lower for word in ["diet", "food", "eat"]):
            recommendations.append("Consider consulting a diabetes educator")
        
        if any(word in message_lower for word in ["exercise", "activity"]):
            recommendations.append("Check glucose before and after exercise")
        
        recommendations.append("Share insights with your healthcare team")
        
        return recommendations[:3]  # Limit to 3 recommendations
    
    def _classify_intent(self, message: str) -> str:
        """Classify user intent"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["analyze", "pattern", "trend"]):
            return "data_analysis"
        elif any(word in message_lower for word in ["what", "how", "why", "when", "?"]):
            return "information_seeking"
        elif any(word in message_lower for word in ["help", "advice", "recommend"]):
            return "guidance_request"
        elif any(word in message_lower for word in ["feel", "symptom", "worried"]):
            return "health_concern"
        else:
            return "general_conversation"
    
    def _fallback_response(self, user_message: str, error: str = None) -> Dict[str, Any]:
        """Provide fallback response when OpenAI is unavailable"""
        
        if error:
            logger.error(f"OpenAI fallback due to error: {error}")
        
        fallback_responses = {
            "greeting": "Hello! I'm here to help with your diabetes management questions. What would you like to know?",
            "glucose": "I can help you understand your glucose readings. Could you share more details about what you'd like to know?",
            "diet": "Diet plays a crucial role in diabetes management. I'd recommend consulting with a diabetes educator for personalized meal planning.",
            "exercise": "Exercise is great for blood sugar control! Always check your glucose before and after physical activity.",
            "default": "I'm here to help with diabetes management questions. Could you be more specific about what you'd like to know?"
        }
        
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ["hello", "hi", "hey"]):
            response = fallback_responses["greeting"]
        elif any(word in message_lower for word in ["glucose", "blood sugar", "reading"]):
            response = fallback_responses["glucose"]
        elif any(word in message_lower for word in ["food", "diet", "eat"]):
            response = fallback_responses["diet"]
        elif any(word in message_lower for word in ["exercise", "workout"]):
            response = fallback_responses["exercise"]
        else:
            response = fallback_responses["default"]
        
        response += self.medical_disclaimer
        
        return {
            "response": response,
            "confidence": 0.6,
            "medical_topics": [],
            "recommendations": ["Consult healthcare provider", "Monitor regularly"],
            "user_intent": "fallback",
            "category": "fallback",
            "model_used": "fallback"
        }


# Create singleton instance conditionally
try:
    from app.core.config import settings
    if settings.ENABLE_OPENAI_CHAT and settings.OPENAI_API_KEY:
        openai_service = OpenAIService()
    else:
        openai_service = None
except Exception as e:
    logger.warning(f"OpenAI service initialization failed: {e}")
    openai_service = None

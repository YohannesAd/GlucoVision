"""
GlucoVision AI Chat Service
===========================

Professional AI chat service for diabetes-focused conversations.
Provides intelligent, context-aware responses with medical accuracy.

Features:
- Diabetes-specific knowledge base
- Context-aware responses
- Medical fact verification
- User learning and personalization
- Safe medical guidance
"""

import re
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.models.user import User
from app.models.chat import ChatMessage
from app.models.glucose_log import GlucoseLog
from app.services.ai_service import GlucoseAIService
from app.services.openai_service import openai_service

# Configure logging
logger = logging.getLogger(__name__)


class AIChatService:
    """
    Professional AI Chat Service for Diabetes Management
    
    Provides intelligent chat responses with medical context and learning.
    """
    
    def __init__(self):
        self.glucose_ai = GlucoseAIService()
        self.medical_disclaimer = (
            "⚠️ This AI provides general diabetes information only. "
            "Always consult your healthcare provider for medical decisions."
        )
        
        # Diabetes knowledge base
        self.diabetes_knowledge = {
            "normal_ranges": {
                "fasting": {"min": 70, "max": 100, "unit": "mg/dL"},
                "postprandial": {"min": 70, "max": 140, "unit": "mg/dL"},
                "bedtime": {"min": 100, "max": 140, "unit": "mg/dL"}
            },
            "diabetes_ranges": {
                "target": {"min": 80, "max": 180, "unit": "mg/dL"},
                "hypoglycemia": {"threshold": 70, "unit": "mg/dL"},
                "hyperglycemia": {"threshold": 250, "unit": "mg/dL"}
            },
            "common_topics": [
                "blood sugar", "glucose", "insulin", "carbohydrates", "exercise",
                "medication", "diet", "symptoms", "complications", "monitoring"
            ]
        }
    
    async def generate_response(
        self,
        user_message: str,
        user: User,
        conversation_context: List[ChatMessage],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Generate intelligent AI response using OpenAI GPT-4
        """
        try:
            # Get user's glucose context
            glucose_context = await self._get_glucose_context(user, db)

            # Convert conversation context to format expected by OpenAI service
            conversation_history = []
            for msg in conversation_context:
                conversation_history.append({
                    "message_type": msg.message_type.value,
                    "content": msg.content,
                    "created_at": msg.created_at.isoformat()
                })

            # Use OpenAI service for intelligent response
            response_data = await openai_service.generate_response(
                user_message=user_message,
                user=user,
                glucose_context=glucose_context,
                conversation_history=conversation_history
            )

            return response_data

        except Exception as e:
            logger.error(f"AI chat response generation error: {e}")
            return {
                "response": (
                    "I apologize, but I'm having trouble processing your message right now. "
                    "Please try rephrasing your question about diabetes management. "
                    f"{self.medical_disclaimer}"
                ),
                "confidence": 0.5,
                "medical_topics": [],
                "recommendations": [],
                "user_intent": "unknown",
                "category": "error"
            }
    

    
    async def _get_glucose_context(self, user: User, db: AsyncSession) -> Dict[str, Any]:
        """Get user's recent glucose context"""
        try:
            # Get recent glucose logs
            recent_logs = await GlucoseLog.get_user_logs(
                db, user_id=user.id, limit=10
            )
            
            if not recent_logs:
                return {"has_data": False}
            
            # Calculate basic stats
            values = [log.glucose_value for log in recent_logs]
            avg_glucose = sum(values) / len(values)
            latest_reading = recent_logs[0].glucose_value
            
            # Time in range calculation
            target_min = user.target_range_min or 80
            target_max = user.target_range_max or 180
            in_range_count = sum(1 for val in values if target_min <= val <= target_max)
            time_in_range = (in_range_count / len(values)) * 100
            
            return {
                "has_data": True,
                "latest_reading": latest_reading,
                "average_glucose": round(avg_glucose, 1),
                "time_in_range": round(time_in_range, 1),
                "reading_count": len(recent_logs),
                "target_range": {"min": target_min, "max": target_max}
            }
            
        except Exception as e:
            logger.error(f"Error getting glucose context: {e}")
            return {"has_data": False}
    


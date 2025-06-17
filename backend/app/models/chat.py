"""
GlucoVision Chat Models
=======================

Professional chat models for AI conversation management.
Handles chat conversations, messages, and learning data for diabetes-focused AI.

Features:
- Conversation history storage
- Message threading and context
- AI learning and personalization
- Medical conversation tracking
- User preference learning
"""

from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, Enum, JSON, Float
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import enum
import uuid

from app.core.database import Base


class MessageTypeEnum(enum.Enum):
    """Message type enumeration"""
    USER = "user"
    AI = "ai"
    SYSTEM = "system"


class ChatConversation(Base):
    """
    Chat Conversation Model
    
    Manages AI chat conversations with context and learning capabilities.
    Stores conversation metadata and user preferences.
    """
    
    __tablename__ = "chat_conversations"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Key to User
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Conversation Metadata
    title = Column(String, nullable=True)  # Auto-generated or user-set title
    is_active = Column(Boolean, default=True, nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False)
    
    # Context and Learning
    conversation_context = Column(JSON, nullable=True)  # Current conversation context
    user_preferences = Column(JSON, nullable=True)  # Learned user preferences
    medical_context = Column(JSON, nullable=True)  # Medical context from user data
    
    # Analytics
    message_count = Column(Integer, default=0, nullable=False)
    last_ai_response_time = Column(Float, nullable=True)  # Response time in seconds
    user_satisfaction = Column(Integer, nullable=True)  # 1-5 rating
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    last_message_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<ChatConversation(id={self.id}, user_id={self.user_id}, messages={self.message_count})>"

    @classmethod
    async def get_user_conversations(
        cls,
        db: AsyncSession,
        user_id: str,
        limit: int = 50,
        include_archived: bool = False
    ) -> List['ChatConversation']:
        """Get user's chat conversations"""
        query = select(cls).where(cls.user_id == user_id)
        
        if not include_archived:
            query = query.where(cls.is_archived == False)
            
        query = query.order_by(cls.updated_at.desc()).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    @classmethod
    async def get_active_conversation(
        cls,
        db: AsyncSession,
        user_id: str
    ) -> Optional['ChatConversation']:
        """Get user's active conversation"""
        query = select(cls).where(
            cls.user_id == user_id,
            cls.is_active == True,
            cls.is_archived == False
        ).order_by(cls.updated_at.desc())
        
        result = await db.execute(query)
        return result.scalars().first()


class ChatMessage(Base):
    """
    Chat Message Model
    
    Individual chat messages with AI context and learning data.
    Supports diabetes-specific conversation tracking.
    """
    
    __tablename__ = "chat_messages"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    conversation_id = Column(String, ForeignKey("chat_conversations.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Message Content
    message_type = Column(Enum(MessageTypeEnum), nullable=False)
    content = Column(Text, nullable=False)
    
    # AI Context
    ai_confidence = Column(Float, nullable=True)  # AI confidence score 0-1
    ai_model_version = Column(String, nullable=True)  # AI model version used
    processing_time = Column(Float, nullable=True)  # Processing time in seconds
    
    # Medical Context
    glucose_context = Column(JSON, nullable=True)  # Related glucose data
    medical_topics = Column(JSON, nullable=True)  # Identified medical topics
    recommendations_given = Column(JSON, nullable=True)  # AI recommendations
    
    # User Interaction
    user_feedback = Column(Integer, nullable=True)  # 1-5 rating
    is_helpful = Column(Boolean, nullable=True)  # User marked as helpful
    follow_up_needed = Column(Boolean, default=False, nullable=False)
    
    # Learning Data
    user_intent = Column(String, nullable=True)  # Classified user intent
    response_category = Column(String, nullable=True)  # Response category
    learning_data = Column(JSON, nullable=True)  # Additional learning context
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    edited_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<ChatMessage(id={self.id}, type={self.message_type}, conversation={self.conversation_id})>"

    @classmethod
    async def get_conversation_messages(
        cls,
        db: AsyncSession,
        conversation_id: str,
        limit: int = 100,
        offset: int = 0
    ) -> List['ChatMessage']:
        """Get messages for a conversation"""
        query = select(cls).where(
            cls.conversation_id == conversation_id
        ).order_by(cls.created_at.asc()).offset(offset).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    @classmethod
    async def get_recent_context(
        cls,
        db: AsyncSession,
        conversation_id: str,
        context_messages: int = 10
    ) -> List['ChatMessage']:
        """Get recent messages for context"""
        query = select(cls).where(
            cls.conversation_id == conversation_id
        ).order_by(cls.created_at.desc()).limit(context_messages)
        
        result = await db.execute(query)
        messages = result.scalars().all()
        return list(reversed(messages))  # Return in chronological order

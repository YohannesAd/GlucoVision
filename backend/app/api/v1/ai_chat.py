"""
GlucoVision AI Chat Endpoints
=============================

Professional AI chat endpoints for diabetes-focused conversations.
Provides intelligent chat responses with medical context and learning capabilities.

Features:
- Context-aware AI responses
- Conversation history management
- Medical-grade diabetes information
- User learning and personalization
- Real-time chat processing
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import logging
import time

from app.core.database import get_async_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat import ChatConversation, ChatMessage, MessageTypeEnum
from app.services.ai_chat_service import AIChatService

# Configure logging
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()

# Initialize AI chat service
ai_chat_service = AIChatService()


# Request/Response Models
class ChatMessageRequest(BaseModel):
    """Chat message request model"""
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID")


class ChatMessageResponse(BaseModel):
    """Chat message response model"""
    id: str
    conversation_id: str
    message_type: str
    content: str
    ai_confidence: Optional[float]
    medical_topics: Optional[List[str]]
    recommendations: Optional[List[str]]
    created_at: str


class ConversationResponse(BaseModel):
    """Conversation response model"""
    id: str
    title: Optional[str]
    message_count: int
    last_message_at: Optional[str]
    created_at: str


class ChatHistoryResponse(BaseModel):
    """Chat history response model"""
    conversation_id: str
    messages: List[ChatMessageResponse]
    has_more: bool
    total_messages: int


@router.post("/chat", response_model=ChatMessageResponse)
async def send_chat_message(
    request: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Send Chat Message to AI
    
    Processes user messages and generates AI responses with medical context.
    Creates new conversations or continues existing ones.
    
    **Features:**
    - Context-aware AI responses
    - Medical diabetes information
    - Personalized recommendations
    - Learning from user interactions
    """
    try:
        start_time = time.time()
        
        # Get or create conversation
        if request.conversation_id:
            conversation = await db.get(ChatConversation, request.conversation_id)
            if not conversation or conversation.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found"
                )
        else:
            # Create new conversation
            conversation = ChatConversation(
                user_id=current_user.id,
                title=f"Chat {datetime.utcnow().strftime('%m/%d %H:%M')}",
                medical_context={
                    "diabetes_type": current_user.diabetes_type.value if current_user.diabetes_type else None,
                    "medications": current_user.current_medications,
                    "target_range": {
                        "min": current_user.target_range_min,
                        "max": current_user.target_range_max
                    }
                }
            )
            db.add(conversation)
            await db.flush()  # Get the ID
        
        # Save user message
        user_message = ChatMessage(
            conversation_id=conversation.id,
            user_id=current_user.id,
            message_type=MessageTypeEnum.USER,
            content=request.message.strip()
        )
        db.add(user_message)
        
        # Get conversation context
        recent_messages = await ChatMessage.get_recent_context(
            db, conversation.id, context_messages=10
        )
        
        # Generate AI response
        ai_response_data = await ai_chat_service.generate_response(
            user_message=request.message,
            user=current_user,
            conversation_context=recent_messages,
            db=db
        )
        
        processing_time = time.time() - start_time
        
        # Save AI response
        ai_message = ChatMessage(
            conversation_id=conversation.id,
            user_id=current_user.id,
            message_type=MessageTypeEnum.AI,
            content=ai_response_data["response"],
            ai_confidence=ai_response_data.get("confidence", 0.85),
            processing_time=processing_time,
            medical_topics=ai_response_data.get("medical_topics", []),
            recommendations_given=ai_response_data.get("recommendations", []),
            user_intent=ai_response_data.get("user_intent"),
            response_category=ai_response_data.get("category")
        )
        db.add(ai_message)
        
        # Update conversation
        conversation.message_count += 2  # User + AI message
        conversation.last_message_at = datetime.utcnow()
        conversation.last_ai_response_time = processing_time
        
        await db.commit()
        
        logger.info(f"Chat response generated for user {current_user.id} in {processing_time:.2f}s")
        
        return ChatMessageResponse(
            id=ai_message.id,
            conversation_id=conversation.id,
            message_type=ai_message.message_type.value,
            content=ai_message.content,
            ai_confidence=ai_message.ai_confidence,
            medical_topics=ai_message.medical_topics,
            recommendations=ai_message.recommendations_given,
            created_at=ai_message.created_at.isoformat()
        )
        
    except Exception as e:
        logger.error(f"Chat message error for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message"
        )


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    limit: int = 20
):
    """
    Get User Chat Conversations
    
    Retrieves user's chat conversation history with metadata.
    """
    try:
        conversations = await ChatConversation.get_user_conversations(
            db, current_user.id, limit=limit
        )
        
        return [
            ConversationResponse(
                id=conv.id,
                title=conv.title,
                message_count=conv.message_count,
                last_message_at=conv.last_message_at.isoformat() if conv.last_message_at else None,
                created_at=conv.created_at.isoformat()
            )
            for conv in conversations
        ]
        
    except Exception as e:
        logger.error(f"Get conversations error for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversations"
        )


@router.get("/conversations/{conversation_id}/messages", response_model=ChatHistoryResponse)
async def get_conversation_history(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    limit: int = 50,
    offset: int = 0
):
    """
    Get Conversation Message History
    
    Retrieves messages for a specific conversation with pagination.
    """
    try:
        # Verify conversation ownership
        conversation = await db.get(ChatConversation, conversation_id)
        if not conversation or conversation.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Get messages
        messages = await ChatMessage.get_conversation_messages(
            db, conversation_id, limit=limit + 1, offset=offset  # +1 to check if more exist
        )
        
        has_more = len(messages) > limit
        if has_more:
            messages = messages[:limit]
        
        message_responses = [
            ChatMessageResponse(
                id=msg.id,
                conversation_id=msg.conversation_id,
                message_type=msg.message_type.value,
                content=msg.content,
                ai_confidence=msg.ai_confidence,
                medical_topics=msg.medical_topics,
                recommendations=msg.recommendations_given,
                created_at=msg.created_at.isoformat()
            )
            for msg in messages
        ]
        
        return ChatHistoryResponse(
            conversation_id=conversation_id,
            messages=message_responses,
            has_more=has_more,
            total_messages=conversation.message_count
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation history error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation history"
        )

import express from 'express';
import { getAIResponse } from '../config/ai.js';

const router = express.Router();

// Store conversation history (in-memory for now)
// In production, you might want to use a database
const conversations = new Map();

// POST /api/chat - Handle chat messages
router.post('/', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                error: 'Invalid message',
                message: 'Message is required and must be a non-empty string'
            });
        }

        // Get or create conversation history
        const conversationId = sessionId || 'default';
        if (!conversations.has(conversationId)) {
            conversations.set(conversationId, []);
        }
        const history = conversations.get(conversationId);

        // Add user message to history
        history.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        console.log(`📨 Received message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);

        // Get AI response
        // THIS IS WHERE YOU'LL INTEGRATE YOUR AI MODEL
        const aiResponse = await getAIResponse(message, history);

        // Add AI response to history
        history.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        // Keep only last 20 messages to prevent memory issues
        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        console.log(`🤖 AI response: "${aiResponse.substring(0, 50)}${aiResponse.length > 50 ? '...' : ''}"`);

        // Send response
        res.json({
            response: aiResponse,
            sessionId: conversationId
        });

    } catch (error) {
        console.error('Error in chat route:', error);
        res.status(500).json({
            error: 'Failed to process message',
            message: 'An error occurred while processing your message. Please try again.'
        });
    }
});

// GET /api/chat/history/:sessionId - Get conversation history (optional)
router.get('/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const history = conversations.get(sessionId) || [];

    res.json({
        sessionId,
        messages: history,
        count: history.length
    });
});

// DELETE /api/chat/history/:sessionId - Clear conversation history (optional)
router.delete('/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    conversations.delete(sessionId);

    res.json({
        message: 'Conversation history cleared',
        sessionId
    });
});

export default router;

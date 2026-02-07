import express from 'express';
import { classifyEmotion } from '../chatbot/classifier.js';
import { assessIntensity } from '../chatbot/intensityAssessor.js';
import { generateResponse } from '../chatbot/responseGenerator.js';
import { generateAIResponse } from '../chatbot/aiConversation.js';
import { addMessage, getHistory } from '../chatbot/conversationMemory.js';
import { logMetadata } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/chat
 * Hybrid chatbot endpoint
 */
router.post('/', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide a valid message'
            });
        }

        const trimmedMessage = message.trim();

        // 1. Crisis Detection (Keyword-based)
        const emotion = classifyEmotion(trimmedMessage);
        const intensity = assessIntensity(trimmedMessage);

        console.log(`📨 [${sessionId}] Emotion: ${emotion}, Intensity: ${intensity}`);

        // 2. High Intensity (Crisis) Handling
        if (intensity === 'high') {
            const templateResponse = generateResponse(emotion, intensity);
            logMetadata(emotion, intensity);

            return res.json({
                response: templateResponse.message,
                actions: templateResponse.actions,
                mode: 'template',
                reason: 'crisis_detected',
                sessionId
            });
        }

        // 3. AI Mode (Low/Medium Intensity)
        if (process.env.OPENAI_API_KEY) {
            try {
                const history = getHistory(sessionId);
                const aiResponse = await generateAIResponse(trimmedMessage, history);

                // Update Memory
                addMessage(sessionId, 'user', trimmedMessage);
                addMessage(sessionId, 'assistant', aiResponse.message);

                logMetadata(emotion, intensity);

                return res.json({
                    response: aiResponse.message,
                    actions: aiResponse.actions,
                    mode: 'ai',
                    sessionId
                });
            } catch (aiError) {
                console.error('AI Processing failed, falling back to templates:', aiError.message);
            }
        }

        // 4. Fallback to Templates
        const fallbackResponse = generateResponse(emotion, intensity);
        logMetadata(emotion, intensity);

        return res.json({
            response: fallbackResponse.message,
            actions: fallbackResponse.actions,
            mode: 'template',
            reason: process.env.OPENAI_API_KEY ? 'ai_failed' : 'ai_disabled',
            sessionId
        });

    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Something went wrong while processing your message.'
        });
    }
});

/**
 * GET /api/chat/history/:sessionId
 */
router.get('/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const history = getHistory(sessionId);
    res.json({ sessionId, messages: history });
});

export default router;

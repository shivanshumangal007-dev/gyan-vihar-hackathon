/**
 * Mental First-Aid Chatbot Server - HYBRID AI VERSION
 * 
 * Combines keyword-based crisis detection with AI conversation
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { classifyEmotion } = require('./chatbot/classifier');
const { assessIntensity } = require('./chatbot/intensityAssessor');
const { generateResponse } = require('./chatbot/responseGenerator');
const { generateAIResponse } = require('./chatbot/aiConversation');
const { addMessage, getHistory } = require('./chatbot/conversationMemory');
const { logMetadata, getStats } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;
const AI_MODE = process.env.AI_MODE === 'true';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

/**
 * POST /api/chat
 * 
 * Hybrid chatbot endpoint
 * - Uses keywords for crisis detection (fast, reliable)
 * - Uses AI for conversation (natural, empathetic)
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide a valid message'
            });
        }

        // Step 1: ALWAYS do crisis detection first (keyword-based, fast, reliable)
        const emotion = classifyEmotion(message);
        const intensity = assessIntensity(message);

        // Step 2: If HIGH intensity (crisis), use template response (no AI)
        if (intensity === 'high') {
            const response = generateResponse(emotion, intensity);
            logMetadata(emotion, intensity);

            return res.json({
                ...response,
                mode: 'template',
                reason: 'crisis_detected'
            });
        }

        // Step 3: For LOW/MEDIUM intensity, use AI if enabled
        if (AI_MODE && process.env.OPENAI_API_KEY) {
            try {
                // Get conversation history
                const history = getHistory(sessionId);

                // Generate AI response
                const aiResponse = await generateAIResponse(message, history);

                // Add to conversation memory
                addMessage(sessionId, 'user', message);
                addMessage(sessionId, 'assistant', aiResponse.message);

                // Log metadata
                logMetadata(emotion, intensity);

                return res.json({
                    emotion,
                    intensity,
                    message: aiResponse.message,
                    actions: aiResponse.actions,
                    mode: 'ai',
                    sessionId
                });

            } catch (aiError) {
                console.error('AI failed, falling back to templates:', aiError.message);
                // Fall through to template response
            }
        }

        // Step 4: Fallback to template response
        const response = generateResponse(emotion, intensity);
        logMetadata(emotion, intensity);

        res.json({
            ...response,
            mode: 'template',
            reason: AI_MODE ? 'ai_fallback' : 'ai_disabled'
        });

    } catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Something went wrong. Please try again.'
        });
    }
});

/**
 * GET /api/stats
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch statistics'
        });
    }
});

/**
 * GET /health
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'mental-first-aid-chatbot',
        version: '2.0.0-hybrid',
        aiMode: AI_MODE,
        timestamp: new Date().toISOString()
    });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
    res.json({
        service: 'NORMAL Mental First-Aid Chatbot',
        version: '2.0.0-hybrid',
        mode: AI_MODE ? 'AI-powered' : 'Template-based',
        endpoints: {
            chat: 'POST /api/chat',
            stats: 'GET /api/stats',
            health: 'GET /health'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Mental First-Aid Chatbot v2.0 (HYBRID AI)`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Server running on port ${PORT}`);

    // Check AI Configuration
    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;
    console.log(`AI Mode Configured: ${AI_MODE}`);
    console.log(`OpenAI Key Present: ${hasKey ? 'YES' : 'NO'}`);

    if (AI_MODE && !hasKey) {
        console.log(`⚠️  WARNING: AI_MODE is true but no valid API key found. Fallback to templates will occur.`);
    } else if (AI_MODE && hasKey) {
        console.log(`✅ AI Mode ACTIVE - Low/Medium intensity messages will use GPT-4o-mini`);
    } else {
        console.log(`ℹ️  Template Mode ACTIVE - All messages will use pre-written responses`);
    }

    console.log(`\nEndpoints:`);
    console.log(`  - Health: http://localhost:${PORT}/health`);
    console.log(`  - Chat:   POST http://localhost:${PORT}/api/chat`);
    console.log(`  - Stats:  http://localhost:${PORT}/api/stats`);
    console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;

/**
 * AI Conversation Module (ESM Version)
 * 
 * Handles AI-powered conversations using OpenAI.
 */

import OpenAI from 'openai';
import { validateResponse, validateActions } from './safetyValidator.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const SYSTEM_PROMPT = `You are a mental first-aid assistant for students on the NORMAL wellness platform. You are calm, brief, empathetic, and limited.

CRITICAL SAFETY RULES:
- You do NOT diagnose (never say "you have depression/anxiety")
- You do NOT give medical advice
- You do NOT promise outcomes ("everything will be okay")
- You do NOT argue or invalidate feelings
- You ALWAYS stay brief (2-3 sentences max)
- You ALWAYS suggest 2-3 specific action options
- You redirect to professional help when appropriate

Your job is to:
1. Listen with empathy
2. Validate feelings without judgment
3. Offer simple, safe next steps
4. Route to appropriate support

Available actions to suggest (choose 2-3):
- breathing: Breathing exercises
- grounding: Grounding techniques
- game: Calming games/activities
- chat: Continue chatting
- counselor: Talk to counselor (for persistent issues)
- helpline: Crisis helpline (emergencies only)
- peer_support: Peer support groups
- study_tips: Academic resources
- sleep_tips: Sleep hygiene tips
- self_care: Self-care activities

RESPONSE FORMAT:
Provide your response as a JSON object:
{
  "message": "Your empathetic response (2-3 sentences, under 250 characters)",
  "actions": ["action1", "action2", "action3"]
}

Example:
{
  "message": "It sounds like exam anxiety is weighing on you. That's completely normal. Would you like to try a grounding exercise, or would talking through what's worrying you help?",
  "actions": ["grounding", "chat", "study_tips"]
}`;

/**
 * Generate AI response
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages
 * @returns {Promise<Object>} - { message, actions }
 */
export async function generateAIResponse(userMessage, conversationHistory = []) {
    try {
        // Build messages array
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: 'json_object' }
        });

        // Parse response
        const aiResponse = JSON.parse(completion.choices[0].message.content);

        // Validate response
        const validation = validateResponse(aiResponse.message);
        if (!validation.valid) {
            console.error('AI response failed safety validation:', validation.violations);
            // Fallback: sanitized response or throw
            return {
                message: "I'm here to listen. It sounds like you're going through a lot. Would you like to try a breathing exercise?",
                actions: [
                    { label: "Breathing exercise", action: "breathing" },
                    { label: "Keep chatting", action: "chat" }
                ]
            };
        }

        // Validate actions
        if (!validateActions(aiResponse.actions)) {
            console.error('Invalid actions:', aiResponse.actions);
            aiResponse.actions = ['chat', 'breathing']; // Safe fallback
        }

        return {
            message: aiResponse.message,
            actions: aiResponse.actions.map(action => ({
                label: getActionLabel(action),
                action: action
            }))
        };

    } catch (error) {
        console.error('AI conversation error:', error.message);
        throw error; // Will trigger fallback to templates
    }
}

/**
 * Get human-readable label for action
 * @param {string} action - Action ID
 * @returns {string} - Human-readable label
 */
function getActionLabel(action) {
    const labels = {
        breathing: 'Breathing exercise',
        grounding: 'Grounding technique',
        game: 'Calming activity',
        chat: 'Keep chatting',
        counselor: 'Talk to a counselor',
        helpline: 'Crisis helpline',
        peer_support: 'Peer support',
        study_tips: 'Study tips',
        sleep_tips: 'Sleep tips',
        self_care: 'Self-care ideas'
    };
    return labels[action] || action;
}

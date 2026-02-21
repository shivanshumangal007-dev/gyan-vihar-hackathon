/**
 * AI Model Integration Placeholder
 * 
 * This file contains the placeholder function for your AI model integration.
 * Replace the implementation of getAIResponse() with your actual AI model API call.
 * 
 * IMPORTANT: This is where you'll integrate your AI model!
 */

/**
 * Get AI response for a user message
 * 
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Array of previous messages with {role, content, timestamp}
 * @returns {Promise<string>} - The AI's response
 * 
 * INTEGRATION GUIDE:
 * ------------------
 * 1. Install your AI SDK (e.g., OpenAI, Anthropic, Gemini, etc.)
 *    Example: npm install openai
 * 
 * 2. Add your API key to .env file:
 *    AI_API_KEY=your_api_key_here
 * 
 * 3. Import your AI SDK at the top of this file
 * 
 * 4. Replace the placeholder implementation below with your API call
 * 
 * EXAMPLE IMPLEMENTATIONS:
 * ------------------------
 * 
 * // Example 1: OpenAI
 * import OpenAI from 'openai';
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * 
 * export async function getAIResponse(userMessage, conversationHistory) {
 *   const messages = conversationHistory.map(msg => ({
 *     role: msg.role === 'assistant' ? 'assistant' : 'user',
 *     content: msg.content
 *   }));
 * 
 *   const completion = await openai.chat.completions.create({
 *     model: "gpt-4",
 *     messages: [
 *       {
 *         role: "system",
 *         content: "You are a supportive, reflective listener. Respond with empathy and without giving advice or diagnosis. Focus on helping the user express their feelings."
 *       },
 *       ...messages
 *     ],
 *     temperature: 0.7,
 *   });
 * 
 *   return completion.choices[0].message.content;
 * }
 * 
 * // Example 2: Anthropic Claude
 * import Anthropic from '@anthropic-ai/sdk';
 * const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 * 
+ * export async function getAIResponse(userMessage, conversationHistory) {
 *   const message = await anthropic.messages.create({
 *     model: "claude-3-sonnet-20240229",
 *     max_tokens: 1024,
 *     messages: conversationHistory.map(msg => ({
 *       role: msg.role === 'assistant' ? 'assistant' : 'user',
 *       content: msg.content
 *     }))
 *   });
 * 
 *   return message.content[0].text;
 * }
 * 
 * // Example 3: Google Gemini
 * import { GoogleGenerativeAI } from '@google/generative-ai';
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 * 
 * export async function getAIResponse(userMessage, conversationHistory) {
 *   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
 *   const chat = model.startChat({
 *     history: conversationHistory.slice(0, -1).map(msg => ({
 *       role: msg.role === 'assistant' ? 'model' : 'user',
 *       parts: [{ text: msg.content }]
 *     }))
 *   });
 * 
 *   const result = await chat.sendMessage(userMessage);
 *   return result.response.text();
 * }
 */

// INTEGRATED WITH IONIZED-COPERNICUS CHATBOT
// Forwards requests to the mental health chatbot API

const CHATBOT_API_URL = "https://normal-chatbot.onrender.com/api/chat";

export async function getAIResponse(userMessage, conversationHistory) {
    try {
        // Generate a session ID based on conversation history length
        // This helps maintain context across the conversation
        const sessionId = `session_${Date.now()}`;

        // Call the ionized-copernicus chatbot API
        const response = await fetch(CHATBOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                sessionId: sessionId
            }),
        });

        if (!response.ok) {
            throw new Error(`Chatbot API error: ${response.status}`);
        }

        const data = await response.json();

        console.log(`🤖 Ionized-Copernicus response - Emotion: ${data.emotion}, Intensity: ${data.intensity}`);

        // Build response with action buttons if available
        let responseText = data.message;

        // If there are suggested actions, append them as options
        if (data.actions && data.actions.length > 0) {
            const actionLabels = data.actions.map(a => a.label).join(' | ');
            responseText += `\n\n[Options: ${actionLabels}]`;
        }

        return responseText;

    } catch (error) {
        console.error('⚠️ Error calling ionized-copernicus API:', error.message);

        // Fallback to a safe default response
        return "I'm here to listen. What's on your mind right now?";
    }
}

/**
 * SYSTEM PROMPT SUGGESTION:
 * -------------------------
 * When you integrate your AI model, consider using a system prompt like this:
 * 
 * "You are a supportive, reflective listener in an anonymous support chat.
 * Your role is to help users express their feelings in a safe, non-judgmental space.
 * 
 * Guidelines:
 * - Be empathetic, calm, and reflective
 * - Ask open-ended questions to help users explore their feelings
 * - Never give advice, diagnosis, or treatment recommendations
 * - Avoid medical or therapy terminology
 * - Focus on emotional expression and validation
 * - Keep responses concise and gentle
 * - If someone mentions self-harm or emergency, remind them to contact local support services
 * 
 * Language to use: share, express, feel, reflect, notice, experience
 * Language to avoid: therapy, diagnosis, cure, treatment, fix, solve, should"
 */

/**
 * Conversation Memory
 * 
 * Manages conversation context for AI (session-based, in-memory)
 * Privacy-compliant: No persistent storage, auto-cleanup
 */

const sessions = new Map();
const MAX_HISTORY = parseInt(process.env.MAX_CONVERSATION_HISTORY) || 5;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Add message to conversation history
 * @param {string} sessionId - Session identifier
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 */
function addMessage(sessionId, role, content) {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            messages: [],
            lastActivity: Date.now()
        });
    }

    const session = sessions.get(sessionId);
    session.messages.push({ role, content });
    session.lastActivity = Date.now();

    // Keep only last N messages
    if (session.messages.length > MAX_HISTORY * 2) {
        session.messages = session.messages.slice(-MAX_HISTORY * 2);
    }
}

/**
 * Get conversation history for a session
 * @param {string} sessionId - Session identifier
 * @returns {Array} - Array of messages
 */
function getHistory(sessionId) {
    const session = sessions.get(sessionId);
    return session ? session.messages : [];
}

/**
 * Clear a session
 * @param {string} sessionId - Session identifier
 */
function clearSession(sessionId) {
    sessions.delete(sessionId);
}

/**
 * Clean up inactive sessions
 */
function cleanupInactiveSessions() {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
            sessions.delete(sessionId);
        }
    }
}

// Run cleanup every 5 minutes
setInterval(cleanupInactiveSessions, 5 * 60 * 1000);

module.exports = {
    addMessage,
    getHistory,
    clearSession
};

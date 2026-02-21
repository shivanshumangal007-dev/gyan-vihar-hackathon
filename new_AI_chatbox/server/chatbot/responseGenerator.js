/**
 * Response Generator (ESM Version)
 * 
 * Generates empathetic, brief, non-diagnostic responses.
 */

export const RESPONSE_TEMPLATES = {
    // LOW INTENSITY RESPONSES
    low: {
        stress: {
            message: "That sounds really tiring. Would you like to slow down for a moment?",
            actions: [
                { label: "Breathe", action: "breathing" },
                { label: "Play a calming game", action: "game" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        anxiety: {
            message: "I hear you. It's okay to feel nervous. Want to try something grounding?",
            actions: [
                { label: "Grounding exercise", action: "grounding" },
                { label: "Breathe", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        sadness: {
            message: "That sounds heavy. You don't have to carry it alone right now.",
            actions: [
                { label: "Listen to calming sounds", action: "sounds" },
                { label: "Breathe", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        academic: {
            message: "Academic pressure can feel overwhelming. Want to take a small break?",
            actions: [
                { label: "Quick break activity", action: "break" },
                { label: "Study tips", action: "study_tips" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        loneliness: {
            message: "Feeling disconnected is hard. Would you like to explore some options?",
            actions: [
                { label: "Connect with peers", action: "peer_connect" },
                { label: "Calming activity", action: "game" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        sleep: {
            message: "Sleep struggles are exhausting. Want to try something that might help?",
            actions: [
                { label: "Sleep tips", action: "sleep_tips" },
                { label: "Relaxation exercise", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        social: {
            message: "Social stuff can be tricky. Want to talk through it?",
            actions: [
                { label: "Social tips", action: "social_tips" },
                { label: "Calming activity", action: "game" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        unknown: {
            message: "I'm here to listen. Would you like to try something calming?",
            actions: [
                { label: "Breathe", action: "breathing" },
                { label: "Play a game", action: "game" },
                { label: "Keep chatting", action: "chat" }
            ]
        }
    },

    // MEDIUM INTENSITY RESPONSES
    medium: {
        stress: {
            message: "That sounds really overwhelming. Let's slow things down together.",
            actions: [
                { label: "Breathing exercise", action: "breathing" },
                { label: "Grounding technique", action: "grounding" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        anxiety: {
            message: "I can hear this feels intense. You're not alone in this moment.",
            actions: [
                { label: "Grounding exercise", action: "grounding" },
                { label: "Breathing technique", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        sadness: {
            message: "That sounds really hard. It's okay to feel this way.",
            actions: [
                { label: "Calming sounds", action: "sounds" },
                { label: "Breathing space", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        academic: {
            message: "Academic stress can feel crushing. Let's take this one step at a time.",
            actions: [
                { label: "Break activity", action: "break" },
                { label: "Talk to someone", action: "peer_support" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        loneliness: {
            message: "Feeling isolated is really painful. You deserve support.",
            actions: [
                { label: "Peer support", action: "peer_support" },
                { label: "Calming activity", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        sleep: {
            message: "Ongoing sleep issues are exhausting. Let's find some support.",
            actions: [
                { label: "Sleep resources", action: "sleep_resources" },
                { label: "Relaxation", action: "breathing" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        social: {
            message: "Social challenges can feel isolating. You're not alone in this.",
            actions: [
                { label: "Peer support", action: "peer_support" },
                { label: "Grounding", action: "grounding" },
                { label: "Keep chatting", action: "chat" }
            ]
        },
        unknown: {
            message: "I can hear this is difficult. Let's find a way to support you.",
            actions: [
                { label: "Breathing exercise", action: "breathing" },
                { label: "Grounding", action: "grounding" },
                { label: "Keep chatting", action: "chat" }
            ]
        }
    },

    // HIGH INTENSITY (CRISIS) RESPONSE
    high: {
        message: "I'm really glad you reached out. You don't have to handle this alone. I can show you support options if you want.",
        actions: [
            { label: "Talk to a counselor", action: "counselor" },
            { label: "Crisis helpline", action: "helpline" },
            { label: "Continue chatting", action: "chat" }
        ]
    }
};

/**
 * Generate response based on emotion and intensity
 * @param {string} emotion - Detected emotion category
 * @param {string} intensity - Detected intensity level
 * @returns {Object} - Response object with message and actions
 */
export function generateResponse(emotion, intensity) {
    if (intensity === 'high') {
        return {
            emotion,
            intensity,
            message: RESPONSE_TEMPLATES.high.message,
            actions: RESPONSE_TEMPLATES.high.actions
        };
    }

    const intensityTemplates = RESPONSE_TEMPLATES[intensity];

    if (!intensityTemplates) {
        return {
            emotion,
            intensity,
            message: RESPONSE_TEMPLATES.low.unknown.message,
            actions: RESPONSE_TEMPLATES.low.unknown.actions
        };
    }

    const template = intensityTemplates[emotion] || intensityTemplates.unknown;

    return {
        emotion,
        intensity,
        message: template.message,
        actions: template.actions
    };
}

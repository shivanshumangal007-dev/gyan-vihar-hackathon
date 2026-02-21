/**
 * Intensity Assessor (ESM Version)
 * 
 * Assesses the intensity of user's emotional state.
 */

export const CRISIS_KEYWORDS = [
    'hopeless', 'can\'t go on', 'give up', 'giving up', 'end it', 'suicide', 'kill myself',
    'hurt myself', 'self harm', 'self-harm', 'die', 'dying', 'death',
    'no point', 'pointless', 'worthless', 'better off dead', 'can\'t take it'
];

export const HIGH_INTENSITY_KEYWORDS = [
    'panic', 'panicking', 'can\'t breathe', 'breaking down', 'falling apart',
    'collapsing', 'can\'t handle', 'too much', 'unbearable', 'overwhelming',
    'drowning', 'suffocating', 'losing control', 'going crazy'
];

export const MEDIUM_INTENSITY_KEYWORDS = [
    'struggling', 'difficult', 'hard', 'exhausted', 'drained', 'worried',
    'anxious', 'stressed', 'overwhelmed', 'tired', 'can\'t focus',
    'can\'t sleep', 'constantly', 'always', 'every day', 'all the time'
];

/**
 * Assess the intensity level of user's message
 * @param {string} message - User's input message
 * @returns {string} - Intensity level: 'low', 'medium', or 'high'
 */
export function assessIntensity(message) {
    if (!message || typeof message !== 'string') {
        return 'low';
    }

    const lowerMessage = message.toLowerCase();

    // Check for crisis keywords first (highest priority)
    for (const keyword of CRISIS_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            return 'high';
        }
    }

    // Check for high intensity keywords
    let highCount = 0;
    for (const keyword of HIGH_INTENSITY_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            highCount++;
        }
    }

    // Multiple high-intensity indicators = crisis
    if (highCount >= 2) {
        return 'high';
    }

    // Check for medium intensity keywords
    let mediumCount = 0;
    for (const keyword of MEDIUM_INTENSITY_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            mediumCount++;
        }
    }

    // Determine intensity based on keyword counts
    if (highCount >= 1) {
        return 'medium'; // Single high-intensity word = medium
    }

    if (mediumCount >= 2) {
        return 'medium'; // Multiple medium indicators = medium
    }

    if (mediumCount >= 1) {
        return 'low'; // Single medium indicator = low
    }

    // Default to low for unclear or mild messages
    return 'low';
}

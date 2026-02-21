/**
 * Safety Validator (ESM Version)
 * 
 * Validates AI responses before sending to users.
 */

export const PROHIBITED_PATTERNS = {
    diagnosis: [
        /you (have|are|might have|could have|probably have) (depression|anxiety|adhd|ptsd|ocd|bipolar)/i,
        /this (is|sounds like|could be) (depression|anxiety|adhd|ptsd|ocd|bipolar)/i,
        /you('re| are) (depressed|anxious|manic)/i
    ],

    medicalAdvice: [
        /you should (take|try|use) (medication|pills|drugs|antidepressants)/i,
        /i (recommend|suggest|advise) (medication|therapy|treatment)/i,
        /(stop|start|change) your medication/i
    ],

    promises: [
        /everything will be (okay|fine|alright|better)/i,
        /you('ll| will) (definitely|certainly) (feel better|be okay|get better)/i,
        /i (promise|guarantee) (you|that|it)/i,
        /this will (definitely|certainly) (work|help)/i
    ],

    invalidation: [
        /you('re| are) (overreacting|being dramatic|too sensitive)/i,
        /(just|simply) (get over it|move on|stop worrying)/i,
        /it('s| is) not that bad/i,
        /others have it worse/i
    ]
};

/**
 * Validate AI response for safety violations
 * @param {string} message - AI generated message
 * @returns {Object} - { valid: boolean, violations: Array, sanitized: string }
 */
export function validateResponse(message) {
    const violations = [];

    // Check for prohibited patterns
    for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(message)) {
                violations.push({
                    category,
                    pattern: pattern.toString(),
                    match: message.match(pattern)[0]
                });
            }
        }
    }

    // Check message length (should be brief)
    if (message.length > 300) {
        violations.push({
            category: 'length',
            message: 'Response too long (> 300 chars)'
        });
    }

    return {
        valid: violations.length === 0,
        violations,
        sanitized: message
    };
}

/**
 * Validate action suggestions
 * @param {Array} actions - Suggested actions
 * @returns {boolean} - Whether actions are valid
 */
export function validateActions(actions) {
    const validActions = [
        'breathing', 'grounding', 'game', 'chat', 'counselor',
        'helpline', 'peer_support', 'study_tips', 'sleep_tips',
        'break', 'sounds', 'social_tips', 'sleep_resources',
        'peer_connect', 'self_care'
    ];

    if (!Array.isArray(actions)) return false;
    if (actions.length < 1 || actions.length > 5) return false; // More flexible for integration

    return actions.every(action => validActions.includes(action));
}

/**
 * Emotion Classifier (ESM Version)
 * 
 * Classifies user messages into ONE emotion category.
 */

export const EMOTION_PATTERNS = {
    stress: [
        'overwhelm', 'stressed', 'pressure', 'too much', 'burden', 'heavy',
        'exhausted', 'tired', 'drained', 'burnt out', 'burnout', 'overload'
    ],

    anxiety: [
        'anxious', 'worry', 'worried', 'nervous', 'panic', 'scared', 'afraid',
        'fear', 'tense', 'restless', 'uneasy', 'on edge'
    ],

    sadness: [
        'sad', 'down', 'depressed', 'hopeless', 'empty', 'numb', 'crying',
        'tears', 'hurt', 'pain', 'miserable', 'unhappy', 'low'
    ],

    academic: [
        'exam', 'test', 'assignment', 'study', 'studies', 'grade', 'fail',
        'failing', 'course', 'class', 'homework', 'project', 'deadline',
        'focus', 'concentrate', 'concentration'
    ],

    loneliness: [
        'lonely', 'alone', 'isolated', 'nobody', 'no one', 'friendless',
        'disconnected', 'left out', 'excluded', 'abandoned'
    ],

    sleep: [
        'sleep', 'insomnia', 'can\'t sleep', 'tired', 'exhausted', 'awake',
        'rest', 'fatigue', 'sleepless'
    ],

    social: [
        'friend', 'friends', 'relationship', 'people', 'social', 'talk',
        'talking', 'conversation', 'connect', 'connection'
    ]
};

/**
 * Classify user message into a single emotion category
 * @param {string} message - User's input message
 * @returns {string} - Emotion category
 */
export function classifyEmotion(message) {
    if (!message || typeof message !== 'string') {
        return 'unknown';
    }

    const lowerMessage = message.toLowerCase();
    const scores = {};

    // Count keyword matches for each emotion
    for (const [emotion, keywords] of Object.entries(EMOTION_PATTERNS)) {
        scores[emotion] = 0;
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
                scores[emotion]++;
            }
        }
    }

    // Find emotion with highest score
    let maxScore = 0;
    let detectedEmotion = 'unknown';

    for (const [emotion, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            detectedEmotion = emotion;
        }
    }

    return detectedEmotion;
}

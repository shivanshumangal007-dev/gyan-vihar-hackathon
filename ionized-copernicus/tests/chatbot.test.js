/**
 * Chatbot Tests
 * 
 * Tests for emotion classification, intensity assessment, and response generation
 */

const { classifyEmotion } = require('../chatbot/classifier');
const { assessIntensity } = require('../chatbot/intensityAssessor');
const { generateResponse } = require('../chatbot/responseGenerator');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`✓ ${testName}`);
        testsPassed++;
    } else {
        console.error(`✗ ${testName}`);
        testsFailed++;
    }
}

function assertEquals(actual, expected, testName) {
    assert(actual === expected, `${testName} (expected: ${expected}, got: ${actual})`);
}

console.log('\n=== EMOTION CLASSIFICATION TESTS ===\n');

// Stress tests
assertEquals(
    classifyEmotion("I feel so overwhelmed with everything"),
    'stress',
    'Should detect stress from "overwhelmed"'
);

assertEquals(
    classifyEmotion("I'm exhausted and burnt out"),
    'stress',
    'Should detect stress from "exhausted" and "burnt out"'
);

// Anxiety tests
assertEquals(
    classifyEmotion("I'm really anxious about tomorrow"),
    'anxiety',
    'Should detect anxiety from "anxious"'
);

assertEquals(
    classifyEmotion("I'm worried and can't stop panicking"),
    'anxiety',
    'Should detect anxiety from "worried" and "panicking"'
);

// Sadness tests
assertEquals(
    classifyEmotion("I feel so sad and empty inside"),
    'sadness',
    'Should detect sadness from "sad" and "empty"'
);

assertEquals(
    classifyEmotion("Everything feels hopeless"),
    'sadness',
    'Should detect sadness from "hopeless"'
);

// Academic tests
assertEquals(
    classifyEmotion("I can't focus on my studies"),
    'academic',
    'Should detect academic from "focus" and "studies"'
);

assertEquals(
    classifyEmotion("I'm failing my exams and assignments"),
    'academic',
    'Should detect academic from "failing", "exams", "assignments"'
);

// Loneliness tests
assertEquals(
    classifyEmotion("I feel so lonely and isolated"),
    'loneliness',
    'Should detect loneliness from "lonely" and "isolated"'
);

// Sleep tests
assertEquals(
    classifyEmotion("I can't sleep at night"),
    'sleep',
    'Should detect sleep from "sleep"'
);

// Social tests
assertEquals(
    classifyEmotion("I'm having trouble with my friends"),
    'social',
    'Should detect social from "friends"'
);

// Unknown tests
assertEquals(
    classifyEmotion("asdfgh"),
    'unknown',
    'Should return unknown for unclear input'
);

assertEquals(
    classifyEmotion(""),
    'unknown',
    'Should return unknown for empty input'
);

console.log('\n=== INTENSITY ASSESSMENT TESTS ===\n');

// Low intensity tests
assertEquals(
    assessIntensity("I feel a bit overwhelmed"),
    'low',
    'Should detect low intensity for mild expression'
);

assertEquals(
    assessIntensity("I'm tired"),
    'low',
    'Should detect low intensity for single mild keyword'
);

// Medium intensity tests
assertEquals(
    assessIntensity("I'm really struggling and exhausted all the time"),
    'medium',
    'Should detect medium intensity for multiple medium keywords'
);

assertEquals(
    assessIntensity("I can't focus on anything and I'm worried constantly"),
    'medium',
    'Should detect medium intensity for persistent issues'
);

assertEquals(
    assessIntensity("I feel overwhelmed and it's too much"),
    'medium',
    'Should detect medium intensity for "too much"'
);

// High intensity (crisis) tests
assertEquals(
    assessIntensity("Everything feels hopeless and I can't go on"),
    'high',
    'Should detect high intensity for crisis keywords'
);

assertEquals(
    assessIntensity("I feel like giving up"),
    'high',
    'Should detect high intensity for "giving up"'
);

assertEquals(
    assessIntensity("I'm panicking and falling apart"),
    'high',
    'Should detect high intensity for multiple high-intensity keywords'
);

// Edge cases
assertEquals(
    assessIntensity(""),
    'low',
    'Should default to low for empty input'
);

assertEquals(
    assessIntensity("This is stupid and useless"),
    'low',
    'Should handle anger calmly as low intensity'
);

console.log('\n=== RESPONSE GENERATION TESTS ===\n');

// Low intensity response test
const lowResponse = generateResponse('stress', 'low');
assert(
    lowResponse.message && lowResponse.actions && lowResponse.actions.length >= 2,
    'Low intensity response should have message and 2+ actions'
);
assert(
    lowResponse.message.length < 200,
    'Low intensity response should be brief (< 200 chars)'
);

// Medium intensity response test
const mediumResponse = generateResponse('anxiety', 'medium');
assert(
    mediumResponse.message && mediumResponse.actions && mediumResponse.actions.length >= 2,
    'Medium intensity response should have message and 2+ actions'
);

// High intensity (crisis) response test
const highResponse = generateResponse('sadness', 'high');
assert(
    highResponse.message.includes('glad you reached out') ||
    highResponse.message.includes('don\'t have to handle this alone'),
    'High intensity response should offer support without panic'
);
assert(
    highResponse.actions.some(a => a.action === 'counselor' || a.action === 'helpline'),
    'High intensity response should include professional support options'
);
assert(
    !highResponse.message.includes('everything will be okay'),
    'High intensity response should NOT promise outcomes'
);

// Safety constraint tests
const allResponses = [
    generateResponse('stress', 'low'),
    generateResponse('anxiety', 'medium'),
    generateResponse('sadness', 'high')
];

allResponses.forEach((response, idx) => {
    assert(
        !response.message.toLowerCase().includes('diagnos'),
        `Response ${idx + 1} should not diagnose`
    );
    assert(
        !response.message.toLowerCase().includes('you have depression') &&
        !response.message.toLowerCase().includes('you have anxiety'),
        `Response ${idx + 1} should not label conditions`
    );
});

console.log('\n=== EDGE CASE TESTS ===\n');

// Repeated distress (should escalate)
const repeatedMessage = "I'm struggling struggling struggling";
const repeatedIntensity = assessIntensity(repeatedMessage);
assert(
    repeatedIntensity === 'medium' || repeatedIntensity === 'high',
    'Repeated distress keywords should escalate intensity'
);

// Mixed emotions (should pick strongest)
const mixedEmotion = classifyEmotion("I'm anxious about exams and feeling lonely");
assert(
    mixedEmotion === 'anxiety' || mixedEmotion === 'academic' || mixedEmotion === 'loneliness',
    'Mixed emotions should classify to one category'
);

console.log('\n=== TEST SUMMARY ===\n');
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log(`Total tests: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ All tests passed!\n');
    process.exit(0);
} else {
    console.log(`\n✗ ${testsFailed} test(s) failed\n`);
    process.exit(1);
}

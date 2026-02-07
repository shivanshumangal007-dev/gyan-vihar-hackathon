/**
 * Interactive CLI for Mental First-Aid Chatbot
 * 
 * Run this to test the chatbot user experience in the terminal
 */

const readline = require('readline');
const { classifyEmotion } = require('./chatbot/classifier');
const { assessIntensity } = require('./chatbot/intensityAssessor');
const { generateResponse } = require('./chatbot/responseGenerator');
const { logMetadata } = require('./utils/logger');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
};

console.log('\n' + colors.bright + colors.cyan + '='.repeat(60) + colors.reset);
console.log(colors.bright + '  NORMAL Mental First-Aid Chatbot - Interactive Mode' + colors.reset);
console.log(colors.bright + colors.cyan + '='.repeat(60) + colors.reset);
console.log(colors.gray + '\nType your message and press Enter. Type "exit" to quit.\n' + colors.reset);

function displayResponse(userMessage, response) {
    console.log('\n' + colors.gray + '─'.repeat(60) + colors.reset);

    // Show internal analysis (for testing purposes)
    console.log(colors.gray + 'Internal Analysis:' + colors.reset);
    console.log(colors.gray + `  Emotion: ${response.emotion}` + colors.reset);
    console.log(colors.gray + `  Intensity: ${response.intensity}` + colors.reset);

    console.log('\n' + colors.bright + 'Chatbot:' + colors.reset);

    // Color-code by intensity
    let messageColor = colors.green;
    if (response.intensity === 'medium') messageColor = colors.yellow;
    if (response.intensity === 'high') messageColor = colors.red;

    console.log(messageColor + response.message + colors.reset);

    // Display action buttons
    console.log('\n' + colors.cyan + 'Actions:' + colors.reset);
    response.actions.forEach((action, idx) => {
        console.log(colors.cyan + `  [${idx + 1}] ${action.label}` + colors.reset);
    });

    console.log(colors.gray + '─'.repeat(60) + colors.reset + '\n');
}

function chat() {
    rl.question(colors.bright + 'You: ' + colors.reset, (userMessage) => {
        // Check for exit
        if (userMessage.toLowerCase() === 'exit' || userMessage.toLowerCase() === 'quit') {
            console.log('\n' + colors.cyan + 'Thank you for using the Mental First-Aid Chatbot. Take care!' + colors.reset + '\n');
            rl.close();
            return;
        }

        // Handle empty input
        if (!userMessage.trim()) {
            console.log(colors.gray + 'Please type a message.\n' + colors.reset);
            chat();
            return;
        }

        // Process message
        const emotion = classifyEmotion(userMessage);
        const intensity = assessIntensity(userMessage);
        const response = generateResponse(emotion, intensity);

        // Log metadata (privacy-compliant)
        logMetadata(emotion, intensity);

        // Display response
        displayResponse(userMessage, response);

        // Continue conversation
        chat();
    });
}

// Start the chat
chat();

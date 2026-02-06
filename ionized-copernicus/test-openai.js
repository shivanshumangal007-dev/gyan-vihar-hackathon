/**
 * Test OpenAI API Connection
 * 
 * Quick diagnostic to check if OpenAI API is working
 */

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testAPI() {
    console.log('\n=== Testing OpenAI API Connection ===\n');

    // Check API key exists
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ ERROR: OPENAI_API_KEY not found in .env file');
        console.log('\nPlease add your API key to .env:');
        console.log('OPENAI_API_KEY=sk-your-key-here\n');
        return;
    }

    console.log('✓ API key found in .env');
    console.log(`  Key starts with: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);

    // Test API call
    console.log('\n⏳ Testing API call...\n');

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "Hello, API is working!"' }
            ],
            max_tokens: 20
        });

        console.log('✅ SUCCESS! API is working!\n');
        console.log('Response:', completion.choices[0].message.content);
        console.log('\nYour hybrid AI chatbot should work now! 🎉\n');

    } catch (error) {
        console.error('❌ API ERROR:', error.message);

        if (error.status === 401) {
            console.log('\n🔑 SOLUTION: Your API key is invalid or expired.');
            console.log('   1. Go to: https://platform.openai.com/api-keys');
            console.log('   2. Create a new API key');
            console.log('   3. Update .env file with the new key\n');
        } else if (error.status === 429) {
            console.log('\n💰 SOLUTION: Rate limit or quota exceeded.');
            console.log('   1. Check your OpenAI account billing');
            console.log('   2. Add payment method if needed\n');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.log('\n🌐 SOLUTION: Network connection issue.');
            console.log('   1. Check your internet connection');
            console.log('   2. Check if firewall is blocking OpenAI API\n');
        } else {
            console.log('\n📋 Full error details:');
            console.log(error);
        }
    }
}

testAPI();

import React, { useState, useRef, useEffect } from 'react';

const SupportChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: 'Hello. This is a safe space for you to express what you\'re feeling. Take your time.',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (inputValue.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setError(null);

        // Show typing indicator
        setIsTyping(true);

        try {
            // Call backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: currentInput })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }

            const data = await response.json();

            const aiMessage = {
                id: messages.length + 2,
                sender: 'ai',
                text: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error:', err);
            setError('Unable to connect to the support service. Please try again.');

            // Add error message to chat
            const errorMessage = {
                id: messages.length + 2,
                sender: 'ai',
                text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="support-chat-container">
            <div className="chat-wrapper">
                <header className="chat-header">
                    <h1 className="header-title">Anonymous Support Chat</h1>
                    <p className="header-subtitle">You are not logged in. This conversation is anonymous.</p>
                </header>

                <div className="chat-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-bubble">
                                <p className="message-text">{message.text}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message-wrapper ai-message">
                            <div className="message-bubble typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-container">
                    <textarea
                        className="chat-input"
                        placeholder="You can share what's on your mind…"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows="1"
                    />
                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={inputValue.trim() === '' || isTyping}
                    >
                        Send
                    </button>
                </div>

                <footer className="chat-footer">
                    <p className="disclaimer-text">
                        This is not a medical service. For emergencies, contact local support.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default SupportChat;

// js/chat.js

const API_BASE = 'http://localhost:8080/api';

// Get DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const loadingDiv = document.getElementById('loading');

// Helper: Add a message to the chat window
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// Send user message to backend
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, true);
    messageInput.value = '';
    loadingDiv.style.display = 'flex';

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You are not logged in. Please log in again.');
        }

        const response = await fetch(`${API_BASE}/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reply || data.error || 'Request failed');
        }

        addMessage(data.reply, false);
    } catch (err) {
        console.error('Chat error:', err);
        addMessage(`Error: ${err.message}`, false);
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
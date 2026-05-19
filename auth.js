const API_BASE = 'http://localhost:8080/api';

// Get stored token
function getToken() {
    return localStorage.getItem('token');
}

// Save token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove token (logout)
function removeToken() {
    localStorage.removeItem('token');
}

// Decode JWT payload (simple)
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload;
    } catch (e) {
        return null;
    }
}

// Get user role from token
function getUserRole() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return null;
    }
}

// Check if logged in
function isLoggedIn() {
    return !!getToken();
}

// Redirect to login if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '../index.html';
    }
}

// Common fetch with auth header
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    if (response.status === 401) {
        removeToken();
        window.location.href = '../index.html';
        throw new Error('Session expired');
    }
    return response;
}

// Logout function
function logout() {
    removeToken();
    window.location.href = '../index.html';
}
const API_BASE = 'http://localhost:8080/api';

let selectedFile = null;

// Load user profile from backend
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '../login.html';
            }
            throw new Error(`HTTP ${response.status}`);
        }
        const user = await response.json();
        document.getElementById('userName').innerText = user.name || 'N/A';
        document.getElementById('userEmail').innerText = user.email || 'N/A';
        document.getElementById('userRole').innerText = user.role || 'N/A';
        
        // Set profile picture – use absolute backend URL
        const profileImg = document.getElementById('profileImage');
        if (user.profilePicture) {
            profileImg.src = 'http://localhost:8080' + user.profilePicture;
        } else {
            profileImg.src = 'https://via.placeholder.com/150?text=User';
        }
    } catch (err) {
        console.error(err);
        showToast('Could not load profile data', true);
    }
}

// Upload profile picture
async function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('file', file);
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';
    try {
        const response = await fetch(`${API_BASE}/users/upload-profile-picture`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed');
        showToast(data.message || 'Profile picture updated');
        // Update image with absolute URL
        const img = document.getElementById('profileImage');
        img.src = 'http://localhost:8080' + data.profilePictureUrl + '?t=' + new Date().getTime();
        selectedFile = null;
        document.getElementById('uploadBtn').disabled = true;
        document.getElementById('previewContainer').style.display = 'none';
    } catch (err) {
        showToast(err.message, true);
    } finally {
        spinner.style.display = 'none';
    }
}

// Remove profile picture
async function removeProfilePicture() {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';
    try {
        const response = await fetch(`${API_BASE}/users/remove-profile-picture`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Removal failed');
        showToast('Profile picture removed');
        document.getElementById('profileImage').src = 'https://via.placeholder.com/150?text=User';
    } catch (err) {
        showToast(err.message, true);
    } finally {
        spinner.style.display = 'none';
    }
}

// Preview image before upload
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('previewContainer').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.className = 'toast-message' + (isError ? ' error' : '');
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

// Set up event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const removeBtn = document.getElementById('removeBtn');

    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.match('image.*')) {
                selectedFile = file;
                previewImage(file);
                uploadBtn.disabled = false;
            } else {
                showToast('Please drop an image file', true);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                selectedFile = file;
                previewImage(file);
                uploadBtn.disabled = false;
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            if (selectedFile) uploadProfilePicture(selectedFile);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', removeProfilePicture);
    }

    loadUserProfile();
});
// Fetch tasks for current user
async function fetchTasks() {
    const response = await apiFetch('/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
}

// Create task (manager only)
async function createTask(taskData) {
    const response = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error('Task creation failed');
    return response.json();
}

// Update task status (employee)
async function updateTaskStatus(taskId, status) {
    const response = await apiFetch(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(status)
    });
    if (!response.ok) throw new Error('Task update failed');
    return response.json();
}
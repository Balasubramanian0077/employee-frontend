// Request leave (employee)
async function requestLeave(leaveData) {
    const response = await apiFetch('/leave', {
        method: 'POST',
        body: JSON.stringify(leaveData)
    });
    if (!response.ok) throw new Error('Leave request failed');
    return response.json();
}

// Approve/reject leave (admin/manager)
async function approveLeave(leaveId, approve) {
    const response = await apiFetch(`/leave/${leaveId}/approve?approve=${approve}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Leave approval failed');
    return response.json();
}
// Fetch pending leave requests (for manager/admin)
async function fetchPendingLeaves() {
    const response = await apiFetch('/leave/pending');
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
}
// Fetch current user's leave requests (employee)
async function fetchMyLeaves() {
    const response = await apiFetch('/leave');
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
}

async function requestLeave(leaveData) {
    const response = await apiFetch('/leave', {
        method: 'POST',
        body: JSON.stringify(leaveData)
    });
    if (!response.ok) throw new Error('Leave request failed');
    return response.json();
}
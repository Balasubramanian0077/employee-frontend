// Generate report (manager only)
async function generateReport(content) {
    const response = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('Report generation failed');
    return response.json();
}

// Fetch all reports (admin only)
async function fetchReports() {
    const response = await apiFetch('/reports');
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
}
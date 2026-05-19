// Get salary for current user
async function fetchSalary() {
    const response = await apiFetch('/salary');
    if (!response.ok) throw new Error('Failed to fetch salary');
    return response.json();
}

// Assign salary (admin only)
async function assignSalary(salaryData) {
    const response = await apiFetch('/salary/assign', {
        method: 'POST',
        body: JSON.stringify(salaryData)
    });
    if (!response.ok) throw new Error('Salary assignment failed');
    return response.json();
}
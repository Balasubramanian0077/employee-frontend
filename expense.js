// Submit expense (employee)
async function submitExpense(expenseData) {
    const response = await apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData)
    });
    if (!response.ok) throw new Error('Expense submission failed');
    return response.json();
}

// Approve/reject expense (admin/manager)
async function approveExpense(expenseId, approve) {
    const response = await apiFetch(`/expenses/${expenseId}/approve?approve=${approve}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Expense approval failed');
    return response.json();
}

// Fetch all expenses (admin only)
async function fetchAllExpenses() {
    const response = await apiFetch('/expenses');
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
}

// Fetch pending expense requests (for manager/admin)
async function fetchPendingExpenses() {
    const response = await apiFetch('/expenses/pending');
    if (!response.ok) throw new Error('Failed to fetch expense requests');
    return response.json();
}
// Fetch current user's expense requests (employee)
async function fetchMyExpenses() {
    const response = await apiFetch('/expenses');
    if (!response.ok) throw new Error('Failed to fetch expense requests');
    return response.json();
}

async function submitExpense(expenseData) {
    const response = await apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData)
    });
    if (!response.ok) throw new Error('Expense submission failed');
    return response.json();
}
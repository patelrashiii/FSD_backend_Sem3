const API_URL = '/api/requests';

const requestForm = document.getElementById('requestForm');
const requestIdInput = document.getElementById('requestId');
const studentNameInput = document.getElementById('studentName');
const emailInput = document.getElementById('email');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const submitBtn = document.getElementById('submitBtn');
const requestsList = document.getElementById('requestsList');

// GET all requests
async function fetchRequests() {
  const res = await fetch(API_URL);
  const requests = await res.json();
  renderRequests(requests);
}

// Render requests on UI
function renderRequests(requests) {
  requestsList.innerHTML = '';
  requests.forEach(req => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4>${req.studentName} (${req.email})</h4>
      <p><strong>Category:</strong> ${req.category} | <strong>Priority:</strong> ${req.priority}</p>
      <p>${req.description}</p>
      <div class="btn-group">
        <button onclick="editRequest('${req.id}')">Edit</button>
        <button onclick="deleteRequest('${req.id}')">Delete</button>
      </div>
    `;
    requestsList.appendChild(card);
  });
}

// POST or PUT request
requestForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = requestIdInput.value;
  const payload = {
    studentName: studentNameInput.value,
    email: emailInput.value,
    category: categoryInput.value,
    description: descriptionInput.value,
    priority: priorityInput.value
  };

  if (id) {
    // PUT (Update)
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // POST (Create)
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  requestForm.reset();
  requestIdInput.value = '';
  submitBtn.textContent = 'Submit Request';
  fetchRequests();
});

// Populate form for update
async function editRequest(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const req = await res.json();

  requestIdInput.value = req.id;
  studentNameInput.value = req.studentName;
  emailInput.value = req.email;
  categoryInput.value = req.category;
  descriptionInput.value = req.description;
  priorityInput.value = req.priority;
  submitBtn.textContent = 'Update Request';
}

// DELETE request
async function deleteRequest(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  fetchRequests();
}

// Initial fetch
fetchRequests();
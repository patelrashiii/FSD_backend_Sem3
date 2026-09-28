const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'requests.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions to read/write JSON file
const readRequests = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

const writeRequests = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/requests - Get all requests
app.get('/api/requests', (req, res) => {
  const requests = readRequests();
  res.json(requests);
});

// GET /api/requests/:id - Get request by ID
app.get('/api/requests/:id', (req, res) => {
  const requests = readRequests();
  const request = requests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
});

// POST /api/requests - Create a new request
app.post('/api/requests', (req, res) => {
  const requests = readRequests();
  const newRequest = {
    id: Date.now().toString(),
    studentName: req.body.studentName,
    email: req.body.email,
    category: req.body.category,
    description: req.body.description,
    priority: req.body.priority
  };
  requests.push(newRequest);
  writeRequests(requests);
  res.status(201).json(newRequest);
});

// PUT /api/requests/:id - Update a request
app.put('/api/requests/:id', (req, res) => {
  const requests = readRequests();
  const index = requests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Request not found' });

  requests[index] = {
    ...requests[index],
    studentName: req.body.studentName || requests[index].studentName,
    email: req.body.email || requests[index].email,
    category: req.body.category || requests[index].category,
    description: req.body.description || requests[index].description,
    priority: req.body.priority || requests[index].priority
  };

  writeRequests(requests);
  res.json(requests[index]);
});

// DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', (req, res) => {
  let requests = readRequests();
  const initialLength = requests.length;
  requests = requests.filter(r => r.id !== req.params.id);

  if (requests.length === initialLength) {
    return res.status(404).json({ message: 'Request not found' });
  }

  writeRequests(requests);
  res.json({ message: 'Request deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
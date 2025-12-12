const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Ensure MongoDB is running on your machine
mongoose.connect('mongodb://127.0.0.1:27017/projetodw')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
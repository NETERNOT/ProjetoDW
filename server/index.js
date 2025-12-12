require('dotenv').config(); // Load variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// FIXED: We check if the environment variable exists, otherwise we warn the user
const dbConnection = process.env.MONGO_URI;

if (!dbConnection) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
  console.error("Please check your .env file or hardcode the string in server/index.js");
}

console.log("Attempting to connect to MongoDB...");

mongoose.connect(dbConnection || "") 
  .then(() => console.log('✅ MongoDB Cloud Connected Successfully!'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
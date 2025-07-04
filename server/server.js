require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

// Middleware
app.use(express.json());

// MongoDB connection (no deprecated options)
const dbURI = process.env.REACT_APP_MONGO_URL;
console.log('MongoDB URI:', dbURI); // Add this line
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

//routes
app.use('/',require('./routes/marksRoutes'))

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

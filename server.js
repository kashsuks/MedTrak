require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// User and Medication Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}));

const Medication = mongoose.model('Medication', new mongoose.Schema({
    username: { type: String, required: true },
    medication: { type: String, required: true },
    dateTaken: { type: String, required: true },
    dosage: { type: String, required: true }
}));

// API to register (Sign up)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Send response
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// API to login (Authenticate)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// API to fetch past medication data
app.get('/medications', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Fetch medications from the database
        const medications = await Medication.find({ username });
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

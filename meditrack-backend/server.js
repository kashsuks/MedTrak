const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const { groq } = require('groq'); // Hypothetical Groq SDK
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Medication Schema and Model
const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  instructions: String,
  userId: String,
});

const Medication = mongoose.model('Medication', medicationSchema);

// Multer for image upload
const upload = multer({ dest: 'uploads/' });

// Route to handle image upload and text extraction
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Extract text using Groq
    const extractedText = await groq.extractText(imagePath);

    // Parse extracted text and save to MongoDB
    const medicationData = {
      name: 'Sample Medication',
      dosage: '500mg',
      instructions: 'Take twice daily',
      userId: req.body.userId,
    };

    const medication = new Medication(medicationData);
    await medication.save();

    res.json({ message: 'Medication saved successfully', medication });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image and save medication' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

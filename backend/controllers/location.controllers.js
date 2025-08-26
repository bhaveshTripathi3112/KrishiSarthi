import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Location Schema
const locationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  diseaseType: { type: String, required: true },
  confidence: { type: Number, default: 0.9 },
  intensity: { type: Number, default: 0.5 },
  reportCount: { type: Number, default: 1 },
  isDiseaseReport: { type: Boolean, default: true },
  detectionMethod: { type: String, default: 'PLANT_SCANNER' },
  testData: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Location = mongoose.model('Location', locationSchema);

// GET - Fetch all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({});
    console.log(`Fetched ${locations.length} locations from MongoDB`);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// POST - Save new location
router.post('/', async (req, res) => {
  try {
    console.log('Received data for saving:', req.body);
    
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    
    console.log('Location saved to MongoDB:', savedLocation._id);
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ error: 'Failed to save location', details: error.message });
  }
});

// DELETE - Clear all locations
router.delete('/', async (req, res) => {
  try {
    const result = await Location.deleteMany({});
    console.log(`Deleted ${result.deletedCount} locations from MongoDB`);
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error clearing locations:', error);
    res.status(500).json({ error: 'Failed to clear locations' });
  }
});

export default router;

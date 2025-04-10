const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');

// Create new accommodation
router.post('/', async (req, res) => {
  try {
    const newAccommodation = new Accommodation(req.body);
    const savedAccommodation = await newAccommodation.save();
    res.status(201).json(savedAccommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all accommodations
router.get('/', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single accommodation by ID
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update accommodation
router.put('/:id', async (req, res) => {
  try {
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAccommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete accommodation
router.delete('/:id', async (req, res) => {
  try {
    const deletedAccommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!deletedAccommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
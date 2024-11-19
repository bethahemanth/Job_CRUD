const express = require('express');
const router = express.Router();
const Job = require('../models/Job')


router.post('/add', async (req, res) => {
  try {
    const { title, company, location, description } = req.body;
    const newJob = new Job({ title, company, location, description });
    await newJob.save();
    res.status(201).json({ message: 'Job added successfully', job: newJob });
  } catch (err) {
    res.status(500).json({ message: 'Error adding job', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { company, location } = req.query;
    const filter = {};
    if (company) filter.company = company;
    if (location) filter.location = location;

    const jobs = await Job.find(filter);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving jobs', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
});

const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;

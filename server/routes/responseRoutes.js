const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');

// Submit a response
router.post('/', async (req, res) => {
  try {
    const form = await Form.findById(req.body.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const response = new Response(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all responses for a form
router.get('/form/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
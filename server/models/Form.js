const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: String,
  text: String,
  image: String
});

const itemSchema = new mongoose.Schema({
  id: String,
  text: String,
  belongsTo: String
});

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['categorize', 'cloze', 'comprehension'], required: true },
  questionText: String,
  image: String,
  categories: [String],
  options: [optionSchema],
  items: [itemSchema],
  blanks: [{
    id: String,
    correctAnswer: String,
    position: Number
  }],
  paragraph: String,
  mcqs: [{
    question: String,
    options: [String],
    correctOption: Number
  }]
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  headerImage: String,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', formSchema);
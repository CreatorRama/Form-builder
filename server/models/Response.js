const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  type: String,
  answers: mongoose.Schema.Types.Mixed
});

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
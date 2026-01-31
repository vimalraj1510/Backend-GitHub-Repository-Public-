const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  evaluatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionId: {
    type: String,
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  remarks: {
    type: String,
    default: ''
  },
  isFinal: {
    type: Boolean,
    default: true,
    immutable: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

// Enforce unique evaluation per submission per evaluator
evaluationSchema.index({ evaluatorId: 1, submissionId: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);

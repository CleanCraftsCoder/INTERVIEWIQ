const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'mixed'],
    default: 'technical'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  questions: [{
    question: String,
    answer: String,
    audioUrl: String, // For recorded answers
    transcript: String,
    analysis: {
      confidence: Number, // 0-100
      fillerWords: Number,
      wpm: Number, // words per minute
      pauses: Number,
      score: Number // 0-100
    },
    timestamp: Date
  }],
  overallAnalysis: {
    totalScore: Number,
    averageConfidence: Number,
    totalFillerWords: Number,
    averageWpm: Number,
    strengths: [String],
    weaknesses: [String],
    feedback: String,
    hiringProbability: Number // 0-100
  },
  duration: Number, // in minutes
  scheduledAt: Date,
  startedAt: Date,
  completedAt: Date,
  transcript: String, // Full interview transcript
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
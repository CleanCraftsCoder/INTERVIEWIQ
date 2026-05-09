const Interview = require('../models/Interview');
const { generateQuestions, analyzeAnswer, generateFeedback } = require('../utils/ai');

// Create new interview
const createInterview = async (req, res) => {
  try {
    const { title, type } = req.body;
    const userId = req.user._id;

    const interview = new Interview({
      user: userId,
      title,
      type: type || 'technical'
    });

    await interview.save();

    // Add to user's interviews
    await User.findByIdAndUpdate(userId, {
      $push: { interviews: interview._id }
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's interviews
const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single interview
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check ownership
    if (interview.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate questions for interview
const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeText, jobType } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const questions = await generateQuestions(resumeText, jobType);

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error generating questions' });
  }
};

// Save interview answer
const saveAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, transcript } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Analyze answer
    const question = interview.questions[questionIndex]?.question;
    const analysis = await analyzeAnswer(question, answer, transcript);

    // Update question
    interview.questions[questionIndex] = {
      ...interview.questions[questionIndex],
      answer,
      transcript,
      analysis,
      timestamp: new Date()
    };

    await interview.save();
    res.json({ message: 'Answer saved', analysis });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete interview and generate feedback
const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate overall analysis
    const questions = interview.questions;
    const totalQuestions = questions.length;

    if (totalQuestions === 0) {
      return res.status(400).json({ message: 'No questions answered' });
    }

    const totalScore = questions.reduce((sum, q) => sum + (q.analysis?.score || 0), 0) / totalQuestions;
    const averageConfidence = questions.reduce((sum, q) => sum + (q.analysis?.confidence || 0), 0) / totalQuestions;
    const totalFillerWords = questions.reduce((sum, q) => sum + (q.analysis?.fillerWords || 0), 0);
    const averageWpm = questions.reduce((sum, q) => sum + (q.analysis?.wpm || 0), 0) / totalQuestions;

    // Generate AI feedback
    const feedback = await generateFeedback({
      questions: interview.questions,
      type: interview.type,
      totalScore,
      averageConfidence
    });

    interview.overallAnalysis = {
      totalScore: Math.round(totalScore),
      averageConfidence: Math.round(averageConfidence),
      totalFillerWords,
      averageWpm: Math.round(averageWpm),
      ...feedback
    };

    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    res.json({
      message: 'Interview completed',
      analysis: interview.overallAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createInterview,
  getUserInterviews,
  getInterview,
  generateInterviewQuestions,
  saveAnswer,
  completeInterview
};
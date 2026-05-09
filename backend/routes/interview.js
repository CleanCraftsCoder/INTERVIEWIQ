const express = require('express');
const router = express.Router();
const {
  createInterview,
  getUserInterviews,
  getInterview,
  generateInterviewQuestions,
  saveAnswer,
  completeInterview
} = require('../controllers/interviewController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/', createInterview);
router.get('/', getUserInterviews);
router.get('/:id', getInterview);
router.post('/generate-questions', generateInterviewQuestions);
router.post('/:id/answer', saveAnswer);
router.post('/:id/complete', completeInterview);

module.exports = router;
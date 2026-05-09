const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder for user-specific routes
// Can be expanded for user management features

router.get('/stats', auth, async (req, res) => {
  try {
    const Interview = require('../models/Interview');
    const stats = await Interview.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          completedInterviews: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageScore: { $avg: '$overallAnalysis.totalScore' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
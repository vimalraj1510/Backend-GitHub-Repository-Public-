const express = require('express');
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorization');
const {
  submitEvaluation,
  getMyEvaluations,
  getAllEvaluations
} = require('../controllers/evaluationController');

const router = express.Router();

// POST /api/evaluations/submit (EVALUATOR only)
router.post('/submit', verifyToken, authorize(['EVALUATOR']), submitEvaluation);

// GET /api/evaluations/my (EVALUATOR only)
router.get('/my', verifyToken, authorize(['EVALUATOR']), getMyEvaluations);

// GET /api/evaluations/all (ADMIN only)
router.get('/all', verifyToken, authorize(['ADMIN']), getAllEvaluations);

module.exports = router;

const mockDb = require('../config/mockDb');

const submitEvaluation = async (req, res) => {
  try {
    const { submissionId, score, remarks } = req.body;
    const evaluatorId = req.user.id;

    // Validation
    if (!submissionId || score === undefined) {
      return res.status(400).json({ message: 'Submission ID and score are required.' });
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be a number between 0 and 100.' });
    }

    // Check if evaluator has already submitted an evaluation for this submission
    const existingEvaluation = mockDb.findEvaluationByEvaluatorAndSubmission(
      evaluatorId,
      submissionId
    );

    if (existingEvaluation) {
      return res.status(409).json({
        message: 'You have already submitted an evaluation for this submission. Scores are final and cannot be modified.'
      });
    }

    // Create and save the evaluation
    const evaluation = mockDb.createEvaluation({
      evaluatorId,
      submissionId,
      score,
      remarks: remarks || ''
    });

    // Get evaluator info
    const evaluator = mockDb.findUserById(evaluatorId);

    res.status(201).json({
      message: 'Evaluation submitted successfully. Score is now final.',
      evaluation: {
        id: evaluation._id,
        evaluator: {
          name: evaluator.name,
          email: evaluator.email
        },
        submissionId: evaluation.submissionId,
        score: evaluation.score,
        remarks: evaluation.remarks,
        isFinal: evaluation.isFinal,
        submittedAt: evaluation.submittedAt
      }
    });
  } catch (error) {
    console.error('Evaluation submission error:', error);
    res.status(500).json({ message: 'Error submitting evaluation.', error: error.message });
  }
};

const getMyEvaluations = async (req, res) => {
  try {
    const evaluatorId = req.user.id;

    const evaluations = mockDb.getEvaluationsByEvaluator(evaluatorId);
    const evaluator = mockDb.findUserById(evaluatorId);

    const formattedEvaluations = evaluations.map(e => ({
      _id: e._id,
      evaluatorId: {
        name: evaluator.name,
        email: evaluator.email,
        role: evaluator.role
      },
      submissionId: e.submissionId,
      score: e.score,
      remarks: e.remarks,
      isFinal: e.isFinal,
      submittedAt: e.submittedAt
    }));

    res.json({
      message: 'Evaluations retrieved successfully.',
      count: formattedEvaluations.length,
      evaluations: formattedEvaluations
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ message: 'Error fetching evaluations.', error: error.message });
  }
};

const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = mockDb.getAllEvaluations();

    const formattedEvaluations = evaluations.map(e => ({
      _id: e._id,
      evaluatorId: e.evaluatorId ? {
        name: e.evaluatorId.name,
        email: e.evaluatorId.email,
        role: e.evaluatorId.role
      } : null,
      submissionId: e.submissionId,
      score: e.score,
      remarks: e.remarks,
      isFinal: e.isFinal,
      submittedAt: e.submittedAt
    }));

    res.json({
      message: 'All evaluations retrieved successfully.',
      count: formattedEvaluations.length,
      evaluations: formattedEvaluations
    });
  } catch (error) {
    console.error('Error fetching all evaluations:', error);
    res.status(500).json({ message: 'Error fetching evaluations.', error: error.message });
  }
};

module.exports = {
  submitEvaluation,
  getMyEvaluations,
  getAllEvaluations
};

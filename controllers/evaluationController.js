const Evaluation = require('../models/Evaluation');
const User = require('../models/User');

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
    const existingEvaluation = await Evaluation.findOne({
      evaluatorId,
      submissionId
    });

    if (existingEvaluation) {
      return res.status(409).json({
        message: 'You have already submitted an evaluation for this submission. Scores are final and cannot be modified.'
      });
    }

    // Create and save the evaluation
    const evaluation = new Evaluation({
      evaluatorId,
      submissionId,
      score,
      remarks: remarks || ''
    });

    await evaluation.save();

    // Populate evaluator details
    const populatedEvaluation = await Evaluation.findById(evaluation._id).populate('evaluatorId', 'name email');

    res.status(201).json({
      message: 'Evaluation submitted successfully. Score is now final.',
      evaluation: {
        id: populatedEvaluation._id,
        evaluator: populatedEvaluation.evaluatorId,
        submissionId: populatedEvaluation.submissionId,
        score: populatedEvaluation.score,
        remarks: populatedEvaluation.remarks,
        isFinal: populatedEvaluation.isFinal,
        submittedAt: populatedEvaluation.submittedAt
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

    const evaluations = await Evaluation.find({ evaluatorId })
      .populate('evaluatorId', 'name email role')
      .sort({ submittedAt: -1 });

    res.json({
      message: 'Evaluations retrieved successfully.',
      count: evaluations.length,
      evaluations
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ message: 'Error fetching evaluations.', error: error.message });
  }
};

const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('evaluatorId', 'name email role')
      .sort({ submittedAt: -1 });

    res.json({
      message: 'All evaluations retrieved successfully.',
      count: evaluations.length,
      evaluations
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

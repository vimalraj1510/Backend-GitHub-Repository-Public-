require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mockDb = require('./config/mockDb');

// Import mock auth and evaluation services
const authControllerMock = require('./controllers/authControllerMock');
const evaluationControllerMock = require('./controllers/evaluationControllerMock');
const verifyToken = require('./middleware/auth');
const authorize = require('./middleware/authorization');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log('====================================');
console.log('INTERNAL EVALUATION MANAGEMENT SYSTEM');
console.log('====================================');
console.log('⚠️  Using In-Memory Database with File Persistence');
console.log('📁 Data stored in: server/config/database.json');
console.log('====================================\n');

// Auth Routes (Mock)
app.post('/api/auth/register', authControllerMock.register);
app.post('/api/auth/login', authControllerMock.login);

// Evaluation Routes (Mock)
app.post('/api/evaluations/submit', verifyToken, authorize(['EVALUATOR']), evaluationControllerMock.submitEvaluation);
app.get('/api/evaluations/my', verifyToken, authorize(['EVALUATOR']), evaluationControllerMock.getMyEvaluations);
app.get('/api/evaluations/all', verifyToken, authorize(['ADMIN']), evaluationControllerMock.getAllEvaluations);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Internal Evaluation Management System API is running.',
    database: 'Mock Database (File-based)',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error.', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔐 JWT Secret: Configured`);
  console.log(`\n📝 API Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/evaluations/submit`);
  console.log(`   GET    /api/evaluations/my`);
  console.log(`   GET    /api/evaluations/all\n`);
});

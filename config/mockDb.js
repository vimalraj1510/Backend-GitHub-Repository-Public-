const fs = require('fs');
const path = require('path');

// In-memory database for demonstration
class MockDatabase {
  constructor() {
    this.users = [];
    this.evaluations = [];
    this.dataFile = path.join(__dirname, 'database.json');
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        const parsed = JSON.parse(data);
        this.users = parsed.users || [];
        this.evaluations = parsed.evaluations || [];
      }
    } catch (error) {
      console.log('Initializing new database...');
    }
  }

  saveData() {
    fs.writeFileSync(this.dataFile, JSON.stringify({
      users: this.users,
      evaluations: this.evaluations
    }, null, 2));
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(user) {
    user._id = Date.now().toString();
    user.createdAt = new Date();
    this.users.push(user);
    this.saveData();
    return user;
  }

  // Evaluation methods
  findEvaluationByEvaluatorAndSubmission(evaluatorId, submissionId) {
    return this.evaluations.find(
      e => e.evaluatorId === evaluatorId && e.submissionId === submissionId
    );
  }

  createEvaluation(evaluation) {
    evaluation._id = Date.now().toString();
    evaluation.submittedAt = new Date();
    evaluation.isFinal = true;
    this.evaluations.push(evaluation);
    this.saveData();
    return evaluation;
  }

  getEvaluationsByEvaluator(evaluatorId) {
    return this.evaluations
      .filter(e => e.evaluatorId === evaluatorId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  getAllEvaluations() {
    return this.evaluations
      .map(e => ({
        ...e,
        evaluatorId: this.findUserById(e.evaluatorId)
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }
}

module.exports = new MockDatabase();

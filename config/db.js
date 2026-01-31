const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('\n⚠️  IMPORTANT: Please set up MongoDB Atlas:');
    console.log('1. Create a free account at https://www.mongodb.com/cloud/atlas');
    console.log('2. Create a cluster');
    console.log('3. Create a database user');
    console.log('4. Update MONGODB_URI in .env file');
    console.log('\nFor now, using in-memory mock database for demonstration...\n');
    
    // Continue anyway for demonstration purposes
    return null;
  }
};

module.exports = connectDB;

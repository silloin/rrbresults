const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/rrbresults').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define Result model
const ResultSchema = new mongoose.Schema({
  ctrl_no: String,
  roll_no: String,
  name: String,
  father_name: String,
  dob: String,
  post: String,
  venue: String,
  result: String
});

const Result = mongoose.model('Result', ResultSchema);

// Seed data
const seedData = [
  { 
    ctrl_no: '1001', 
    roll_no: '259974103185476', 
    name: 'SAGAR MADAN SHISODE',
    father_name: 'MADAN SHISODE',
    dob: '23/03/2000',
    post: 'COMMERCIAL (CLERK)',
    venue: 'NORTHERN RAILWAY, NEW DELHI',
    result: 'QUALIFIED' 
  },
  { 
    ctrl_no: '1002', 
    roll_no: '1122334455', 
    name: 'JANE DOE',
    father_name: 'JOHN DOE',
    dob: '01/01/1999',
    post: 'ASSISTANT LOCO PILOT',
    venue: 'WESTERN RAILWAY, MUMBAI',
    result: 'QUALIFIED' 
  }
];

async function seed() {
  try {
    await Result.deleteMany({});
    await Result.insertMany(seedData);
    console.log('Test data seeded');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();

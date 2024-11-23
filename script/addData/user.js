const mongoose = require('mongoose');
const User = require('../../src/models/user.schema');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/admin_dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Function to generate random user data
const generateRandomUser = (index) => {
  const roles = ['Admin', 'User', 'Guest'];
  const role = roles[Math.floor(Math.random() * roles.length)];

  return {
    name: `User ${index}`,
    email: `user${index}@example.com`,
    password: `password${index}`,
    role: role,
    status: Math.random() < 0.5, // Randomly set online/offline status
    phone: `123456789${index}`,
    address: `Address ${index}`,
  };
};

// Add 50 users to the database
const addUsers = async () => {
  try {
    // Generate 50 users
    const users = [];
    for (let i = 1; i <= 50; i++) {
      users.push(generateRandomUser(i));
    }

    // Insert the users into MongoDB
    await User.insertMany(users);
    console.log('Successfully added 50 users');
  } catch (err) {
    console.error('Error adding users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Call the function to add users
addUsers();

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

// Add a single admin user
const addAdminUser = async () => {
  try {
    // Admin user data
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass', // Ideally, you should hash this password before saving it.
      role: 'Admin',
      status: true, // You can set the status to true (online) for admin.
      phone: '1234567890',
      address: 'Admin Address',
    };

    // Insert the admin user into MongoDB
    await User.create(adminUser);
    console.log('Successfully added the admin user');
  } catch (err) {
    console.error('Error adding admin user:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Call the function to add the admin user
addAdminUser();

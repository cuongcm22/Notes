
const mongoose = require('mongoose');

const User = require('../../src/models/userSchema');
// Kết nối tới MongoDB
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

const addUsers = async () => {
  try {
    // Dữ liệu mẫu cho 5 người dùng
    const users = [
      { name: 'Admin User', email: 'admin@example.com', password: 'adminpass', role: 'Admin' },
      { name: 'Regular User 1', email: 'user1@example.com', password: 'user1pass', role: 'User' },
      { name: 'Regular User 2', email: 'user2@example.com', password: 'user2pass', role: 'User' },
      { name: 'Guest User 1', email: 'guest1@example.com', password: 'guest1pass', role: 'Guest' },
      { name: 'Guest User 2', email: 'guest2@example.com', password: 'guest2pass', role: 'Guest' },
    ];

    // Thêm dữ liệu vào MongoDB
    await User.insertMany(users);
    console.log('Successfully added 5 users');
  } catch (err) {
    console.error('Error adding users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Gọi hàm thêm người dùng
addUsers();

// helpers/createDefaultUsers.js
const User = require('../models/authModel');
const bcrypt = require('bcryptjs');

const createDefaultUsers = async () => {
  try {
    const usersToCreate = [
      {
        username: 'admin',
        role: 'admin',
        password: 'admin',
      },
      {
        username: 'waiter1',
        role: 'waiter',
        password: 'waiter1',
      },
    ];

    for (const userData of usersToCreate) {
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`User "${userData.username}" already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = new User({
        username: userData.username,
        role: userData.role,
        password: hashedPassword,
      });

      await newUser.save();
      console.log(`User "${userData.username}" created successfully`);
    }
  } catch (error) {
    console.error('Failed to create default users:', error.message);
  }
};

module.exports = createDefaultUsers;
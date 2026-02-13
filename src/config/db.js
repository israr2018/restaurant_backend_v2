// config/db.js
const mongoose = require('mongoose');
const createDefaultUsers = require('../helpers/createDefaultUsers'); 
const createDefaultCategoriesAndMenus = require('../helpers/seedMenusAndCategories'); 
const connectDB = async () => {
  try {
    console.log(`mongo_uri====>${process.env.MONGO_URI}`);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await createDefaultUsers();
    
    await createDefaultCategoriesAndMenus();
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;

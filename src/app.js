// app.js
const express = require('express');
const dotenv = require('dotenv');
const menuRoute = require('./routes/menuRoute');
const orderRoute = require('./routes/orderRoute');
const saleHistoryRoute=require('./routes/saleHistoryRoute');
const menuCategoryRoute = require('./routes/menuCategoryRoute');
const authRoute=require('./routes/authRoute');
const connectDB = require('./config/db');
const cors = require('cors');
const { create } = require('./models/counterModel');
dotenv.config(); // Load environment variables

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Use CORS middleware
app.use(cors());
// Connect to the Database
connectDB();

// health check
app.get("/",(req,res)=>{
  return res.status(200).json({
    status:"healthy"
  })
});

// Routes
app.use('/api/menus', menuRoute);
app.use('/api/menu-categories', menuCategoryRoute);
app.use('/api/orders', orderRoute);
app.use('/api/sale-history', saleHistoryRoute);
app.use('/api/login', authRoute);

// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port: ${PORT}`);
});

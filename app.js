// app.js
const express = require('express');
const dotenv = require('dotenv');
const menuRoute = require('./tenant/routes/menuRoute');
const orderRoute = require('./tenant/routes/orderRoute');
const saleHistoryRoute=require('./tenant/routes/saleHistoryRoute');
const menuCategoryRoute = require('./tenant/routes/menuCategoryRoute');
const authRoute=require('./tenant/routes/authRoute');
const tenantRoute = require('src/platform/routes/tenant.routes');
const adminRoute = require('src/platform/routes/admin.routes');
const connectDB = require('./config/db');
const cors = require('cors');
const { create } = require('./models/counterModel');
const { adminLogin } = require('./src/platform/controllers/admin.controller');
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

app.use('/api/platform/login', adminRoute);
app.use('/api/tenant', tenantRoute);
app.use('/api/tenant/login', authRoute);
app.use('/api/tenant/menus', menuRoute);
app.use('/api/tenant/menu-categories', menuCategoryRoute);
app.use('/api/tenant/orders', orderRoute);
app.use('/api/tenant/sale-history', saleHistoryRoute);

// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port: ${PORT}`);
});

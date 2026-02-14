const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceCounter=require('../../middleware/counter');
const authModel = require('./authModel');
const OrderItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    
  },
  printStatus: {
    type: Boolean,
    default:false
    
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});
const OrderSchema = new Schema({
      orderNumber:{
        type:Number,
      },
      tableNumber: {
        type: Number,
      },
      customerName: {
        type: String,
      },
      orderItems:[
        OrderItemSchema
      ],

      vatRate: {
        type: Number,
        default: 0.15, // Saudi VAT
      },
    
      vatAmount: {
        type: Number,
        required: true,
      },

      totalBill:{
        type:Number, // WITH VAT (FINAL PAYABLE)
      },
      paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdBy: {
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
      },
      recievedBy: {
        type:Schema.Types.ObjectId,
        ref:"users",
        required:false
      },
});
OrderSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.orderNumber == null) {
      const count = await getNextSequenceCounter("Order");
      doc.orderNumber = count;
  }
  next();
});
module.exports = mongoose.model('OrderModel', OrderSchema, 'orders');

const mongoose = require('mongoose');
const getNextSequenceCounter = require('../../middleware/counter');
const MenuSchema = new mongoose.Schema({
  //  categoryId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "CategoryModel",
  //     required: true,
  //     index: true,
  //   },

  menuNumber: {
    type: Number,
  
  },
  name_en: {
    type: String,
    required: true,
    trim: true,
  },
  name_ar: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryModel",
    required: true,
    index: true,
  },

  unitPrice: {
    type: Number,
    required: true,
  },
  
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
MenuSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.menuNumber == null) {
      const count = await getNextSequenceCounter("Menus");
      doc.menuNumber = count;
  }
  next();
});
const MenuModel = mongoose.model('MenuModel', MenuSchema,'menus');

module.exports = MenuModel;

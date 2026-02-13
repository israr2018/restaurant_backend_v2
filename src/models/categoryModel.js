const mongoose = require('mongoose');
const getNextSequenceCounter = require('../middleware/counter');
const CategorySchema = new mongoose.Schema(
  {
    name_ar: {
      type: String,
      required: true,
      trim: true,
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    description_ar: {
      type: String,
      default: "",
    },
    description_en: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    priority_number: {
      type: Number,
      default: 0, // ordering in UI
    },
    category_number: {
      type: Number,
     
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", async function (next) {
  const doc = this;
  if (doc.category_number == null) {
      const count = await getNextSequenceCounter("Category");
      doc.category_number = count;
  }
  next();
});
const CategoryModel = mongoose.model('CategoryModel', CategorySchema,'menu-categories');

module.exports = CategoryModel;
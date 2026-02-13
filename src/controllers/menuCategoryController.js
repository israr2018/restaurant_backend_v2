// controllers/orderController.js
const CategoryModel = require('../models/categoryModel');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res) => {
  try {
    // 🔍 Basic validation
          const { name_en, name_ar, description_ar,description_en,priority_number, isActive=true } = req.body;
        
          if (!name_en || !name_ar  || !priority_number == null) {
            return res.status(400).json({
              message: "Missing required fields",
              required: ["name_en", "name_ar", "priority_number"],
            });
          }

          const category = new CategoryModel({
          name_en: name_en.trim(),
          name_ar: name_ar.trim(),
          description_ar: description_ar ? description_ar.trim() : "",
          description_en: description_en ? description_en.trim() : "",

          priority_number: Number(priority_number),
          isActive,
        });

        const createdCategory = await category.save();

      return res.status(201).json({
        message: "Category created successfully",
        data: createdCategory,
      });

  } catch (error) {

      console.error("CreateCategory Error:", error);
      return res.status(500).json({
        message: "Error creating category",
        error: error.message,
      });
  }
};


// @desc    Get all categories
// @route   GET /api/categories   
// @access  Public
const getPaginatedCategories= async (req, res) => {
  try {
    const {currentPage=1,pageSize=50}=req.query;
    const itemsCount= await CategoryModel.countDocuments();
    // let query={};// 🧮 Pagination safety
    const totalPages = Math.ceil(itemsCount / pageSize);
    const skip = (currentPage - 1) * pageSize;

    const categories= await CategoryModel.find(
      {}
      )
      .sort({createdAt:-1})
      .skip(skip)
      .limit(pageSize)
      .lean();
    
      res.json({
        data: categories,
        pagination: {
          itemsCount,
          totalPages,
          currentPage,
          pageSize
        }
      });
    
  } catch (error) {
    console.log(`error ===>${error}`);
    res.status(500).json({ message: 'Error fetching categories22', error });
  }
};
const getAllCategories= async (req, res) => {
  try {
    
    const itemsCount= await CategoryModel.countDocuments();
    // let query={};

    const categories= await CategoryModel.find(
      {}
      ).sort({createdAt:-1}).exec();
    res.json({data:categories,itemsCount});
  } catch (error) {
    console.log(`error ===>${error}`);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};



const updateCategory = async (req, res) => {
  try {
    const {categoryId,category}=req.body;
    const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, category, { new: true });
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return the updated category if successful
    res.status(200).json(updatedCategory);
  } catch (ex) {
    // Return a 500 status and the error message
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
};

const deleteCategory=async(req,res)=>{
  try{
    const id = req.params.id;
    const result=await CategoryModel.findByIdAndDelete(id);

    if(!result) return res.status(404).json({ message: "Category not found" });
    return  res.status(200).json( {message: "Category deleted successfully!" });
  }
  catch(ex){
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
 
}
const getCategory=async(req,res)=>{
  try{
    const id = req.params.id;
    const result=await  CategoryModel.findById(id);
    if(!result) return res.status(404).json({ message: "Category not found" });
    return  res.status(200).json( result);
  }
  catch(ex){
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
 
};

const toggleIsActive = async (req, res) => {
    const { id } = req.params; // Extract the ID from the route

    try {
       const category = await CategoryModel.findById(id);

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        category.is_active = !category?.is_active;

        await CategoryModel.updateOne(
          { _id: id },
          { $set: { is_active: category?.is_active } }
        );

        return res.status(200).json({
          message: "Category is now " + (category?.is_active ? "active" : "inactive"),
          category: { ...category?.toObject(), is_active: !category.is_active },
        }); 
          


    } catch (error) {
        console.error('Error toggling availability:', error);
        // return res.status(500).json({ message: 'Internal server error' });
        return res.status(500).json({ message: error });
    }
};
module.exports = {
  createCategory,
  // getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
  toggleIsActive,
  getPaginatedCategories,
  getAllCategories
};

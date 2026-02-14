// controllers/orderController.js
const MenuModel = require('../models/menuModel');

// @desc    Create a new menu
// @route   POST /api/menus
// @access  Public
const createMenu = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      category,
      unitPrice,
      availability = true,
    } = req.body;

    // 🔍 Basic validation
    if (!name_en || !name_ar || !category || unitPrice == null) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name_en", "name_ar", "category", "unitPrice"],
      });
    }

    const menu = new MenuModel({
      name_en: name_en.trim(),
      name_ar: name_ar.trim(),
      category: category.trim(),
      unitPrice: Number(unitPrice),
      availability,
    });

    const createdMenu = await menu.save();

    return res.status(201).json({
      message: "Menu created successfully",
      data: createdMenu,
    });

  } catch (error) {
    console.error("CreateMenu Error:", error);

    return res.status(500).json({
      message: "Error creating menu",
      error: error.message,
    });
  }
};


// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
const getMenus= async (req, res) => {
  try {
    let {
      currentPage = 1,
      pageSize = 50,
      filterBy,
      filterByCategory
    } = req.query;
  
    // 🔒 Ensure numbers
    currentPage = Number(currentPage);
    pageSize = Number(pageSize);
  
    const query = {};
  
    // Category filter
    if (filterByCategory && filterByCategory !== 'null') {
      query.category = filterByCategory;
    }
  
    
    // Availability filter
    if (filterBy === 'true' || filterBy === 'false') {
      query.availability = filterBy === 'true';
    }
  
    // 🔢 Count AFTER filters (important!)
    const totalItems = await MenuModel.countDocuments(query);
  
    // 🧮 Pagination safety
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (currentPage - 1) * pageSize;
  
    const menus = await MenuModel.find(query)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(); // ⚡ faster, lighter objects
  
    res.json({
      data: menus,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        pageSize
      }
    });
  
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({
      message: 'Error fetching menus'
    });
  }
  
};


const updateMenu = async (req, res) => {
  try {
    const {menuId,menu}=req.body;
    const updatedMenu = await MenuModel.findByIdAndUpdate(menuId, menu, { new: true });
    
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Return the updated menu if successful
    res.status(200).json(updatedMenu);
  } catch (ex) {
    // Return a 500 status and the error message
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
};

const deleteMenu=async(req,res)=>{
  try{
    const id = req.params.id;
    const result=await MenuModel.findByIdAndDelete(id);
    if(!result) return res.status(404).json({ message: "Menu not found" });
    return  res.status(200).json( {message: "Menu deleted successfully!" });
  }
  catch(ex){
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
 
}
const getMenu=async(req,res)=>{
  try{
    const id = req.params.id;
    const result=await  MenuModel.findById(id);
    if(!result) return res.status(404).json({ message: "Menu not found" });
    return  res.status(200).json( result);
  }
  catch(ex){
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
 
};

const toggleAvailability = async (req, res) => {
    const { id } = req.params; // Extract the ID from the route

    try {
       const menu = await MenuModel.findById(id);

        if (!menu) {
          return res.status(404).json({ message: "Menu not found" });
        }

        menu.availability = !menu.availability;

        await MenuModel.updateOne(
          { _id: id },
          { $set: { availability: menu.availability } }
        );

        return res.status(200).json({
          message: "Availability toggled successfully",
          menu: { ...menu.toObject(), availability: !menu.availability },
        });

    } catch (error) {
        console.error('Error toggling availability:', error);
        // return res.status(500).json({ message: 'Internal server error' });
        return res.status(500).json({ message: error });
    }
};
module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
  getMenu,
  toggleAvailability
};

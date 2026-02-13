const express = require('express');
const { createCategory,getAllCategories,getPaginatedCategories,updateCategory,deleteCategory,toggleIsActive,getCategory} = require('../controllers/menuCategoryController');

const router = express.Router();

// Route for creating a new order
router.post('/', createCategory);
router.get('/all', getAllCategories);
router.get('/', getPaginatedCategories);
router.put('/', updateCategory);
router.put('/:id/toggle-is-active', toggleIsActive);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategory);




module.exports = router;

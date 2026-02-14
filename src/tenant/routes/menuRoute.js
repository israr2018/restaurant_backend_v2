const express = require('express');
const { createMenu, getMenus,updateMenu,deleteMenu,getMenu,toggleAvailability} = require('../controllers/menuController');

const router = express.Router();

// Route for creating a new order
router.post('/', createMenu);
router.get('/', getMenus);
router.put('/', updateMenu);
router.put('/:id/toggle-availability', toggleAvailability);
router.delete('/:id', deleteMenu);
router.get('/:id', getMenu);




module.exports = router;

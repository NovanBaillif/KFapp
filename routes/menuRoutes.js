const express = require('express');
const menuController = require('../controllers/menuController');
const router = express.Router();

router.post('/', menuController.createMenu);
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenu);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);


module.exports = router;

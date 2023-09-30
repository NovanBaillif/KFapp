const express = require('express');
const menuController = require('../controllers/menuController');
const router = express.Router();

router.get('/daily', menuController.getDailyMenu);
router.get('/weekly', menuController.getWeeklyMenu);



module.exports = router;

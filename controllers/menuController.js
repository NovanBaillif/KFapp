const Menu = require('../models/Menu');
const { validationResult, body } = require('express-validator');
const Product = require('../models/Product');
const errorMessages = require('../errorMessages');

const createMenuValidationRules = [
  body('description').optional().trim(),
  body('products').isArray().withMessage(errorMessages.invalidProducts),
  body('type').notEmpty().withMessage(errorMessages.typeRequired).isIn(['daily', 'weekly']).withMessage(errorMessages.invalidType)
];

exports.createMenu = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);

    await Promise.all(createMenuValidationRules.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const productIds = req.body.products;
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    if (productIds.length !== existingProducts.length) {
      return res.status(400).json({ message: errorMessages.invalidProductReferences });
    }

    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().populate('products');
    res.status(200).json(menus);
  } catch (error) {
    next(error);
  }
};

exports.getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('products');
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.updateMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.status(200).json({ message: 'Menu deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getDailyMenu = async (req, res, next) => {
  try {
    const dailyMenu = await Menu.find({ type: 'daily' }).populate({
      path: 'products',
      select: 'name imageUrl description', // Sélectionnez les champs que vous voulez inclure dans le menu
    });// Récupérez les menus quotidiens et leurs produits

    // Maintenant, pour chaque jour du menu quotidien, récupérez les détails des produits
    const dailyMenuWithDetails = dailyMenu.map((dayMenu) => ({
      day: dayMenu.dayOfWeek, // Utilisez le champ dayOfWeek que vous avez défini dans votre schéma de menu
      dishes: dayMenu.products.map((product) => ({
        dish: product.name,
        image: product.imageUrl,
        category: product.description,
      })),
    }));
    // Utilisez JSON.stringify pour afficher le contenu complet de dailyMenuWithDishes
    console.log('Daily Menu with Dishes:', JSON.stringify(dailyMenuWithDetails, null, 2));


    res.status(200).json({ dailyMenu: dailyMenuWithDetails });
  } catch (error) {
    next(error);
  }
};

exports.getWeeklyMenu = async (req, res, next) => {
  try {
    const weeklyMenu = await Menu.find({ type: 'weekly' }).populate({
      path: 'products',
      select: 'name imageUrl description', // Sélectionnez les champs que vous voulez inclure dans le menu
    });
    // Maintenant, pour chaque jour du menu hebdomadaire, récupérez les détails des produits
    const weeklyMenuWithDetails = weeklyMenu.map((dayMenu) => ({
      day: dayMenu.selectedDay,
      dishes: dayMenu.products.map((product) => ({
        dish: product.name,
        image: product.imageUrl,
        category: product.description,
      })),
    }));
    // Utilisez console.dir pour afficher le contenu complet de weeklyMenuWithDetails
    console.log('Weekly Menu with Dishes:', JSON.stringify(weeklyMenuWithDetails, null, 2));

    res.status(200).json({ weeklyMenu: weeklyMenuWithDetails });
  } catch (error) {
    next(error);
  }
};


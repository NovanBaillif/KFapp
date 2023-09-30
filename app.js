const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const planningRoutes = require('./routes/PlanningRoutes');
const menuRoutes = require('./routes/menuRoutes'); 

const errorHandler = require('../../middleware/errorHandler'); // Importez le middleware
require('dotenv').config();
const cors = require('cors'); // Importez le module cors

const app = express();

const origins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

app.use(cors({
    origin: origins.length > 0 ? origins : undefined,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

  


app.use(express.json());

app.use('/menus', menuRoutes);
app.use('/planning', planningRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

app.use(errorHandler); // Utilisez le middleware de gestion des erreurs

const PORT = process.env.PORTMENU || 3001;
app.listen(PORT, () => {
    console.log(`Server menu is running on port ${PORT}`);
});

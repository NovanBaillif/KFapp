const mongoose = require('mongoose');
const { format } = require('date-fns');

const MenuSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  dateMenu: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  selectedDay: { 
    type: String 
  },
  description: {
    type: String,
  }
});

MenuSchema.virtual('dayOfWeek').get(function() {
  if (this.type === 'daily') {
    const dateMenu = new Date(this.dateMenu);
    return format(dateMenu, 'EEEE');
  }
  return null;
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;

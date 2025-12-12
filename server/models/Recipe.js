const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  picture: { type: String }, // URL or Base64 string
  description: { type: String },
  ingredients: [{ type: String }], // Array of strings
  cookingTime: { type: Number }, // In minutes
  servings: { type: Number },
  instructions: [{ type: String }], // List of steps
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
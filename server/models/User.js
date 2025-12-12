const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // Simple array of ObjectIds referencing the Recipe collection
  savedRecipes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe' 
  }]
});

module.exports = mongoose.model('User', UserSchema);
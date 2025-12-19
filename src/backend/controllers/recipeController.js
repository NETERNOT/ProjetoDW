const { getDatabase } = require('../database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'recipes';

async function getAllRecipes(req, res) {
    try {
        const db = getDatabase();
        const recipes = await db.collection(COLLECTION_NAME).find({}).toArray();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(recipes));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function createRecipe(req, res) {
    try {
        const db = getDatabase();
        const recipe = await db.collection(COLLECTION_NAME).insertOne(req.body);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Recipe posted successfully!', recipeTitle: recipe.insertedTitle }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getAllRecipes };
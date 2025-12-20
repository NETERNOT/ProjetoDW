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

async function createRecipe(req, res, body) {
    try {
        const db = getDatabase();
        if (!body) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Body is required' }));
        }

        const recipe = await db.collection(COLLECTION_NAME).insertOne(body);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Recipe posted successfully!', recipeTitle: body.title, id: recipe.insertedId }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function getTags(req, res) {
    try {
        const db = getDatabase();
        const tags = await db.collection(COLLECTION_NAME).distinct('tags');
        // Filter out any null/undefined tags just in case
        const cleanTags = tags.filter(tag => tag);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cleanTags));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getAllRecipes, createRecipe, getTags };
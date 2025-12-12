const { getDatabase } = require('../database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'recipes';

// --- CONTROLLER FUNCTIONS ---

async function getAllRecipes(req, res) {
    try {
        const db = getDatabase();
        // Fetch all documents from the 'recipes' collection
        const recipes = await db.collection(COLLECTION_NAME).find({}).toArray();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(recipes));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function seedDatabase(req, res) {
    // This is a helper to populate your DB with dummy data so you have something to look at
    try {
        const db = getDatabase();
        const count = await db.collection(COLLECTION_NAME).countDocuments();
        
        if (count > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Database already has data.' }));
        }

        const dummyRecipes = [
            {
                title: "Spaghetti Carbonara",
                description: "A classic Italian pasta dish.",
                picture: "https://placehold.co/600x400?text=Carbonara", // Placeholder image
                ingredients: ["Pasta", "Eggs", "Cheese", "Bacon"],
                cookingTime: 20,
                servings: 4,
                tags: ["Italian", "Dinner"],
                instructions: ["Boil pasta", "Fry bacon", "Mix eggs and cheese", "Combine"]
            },
            {
                title: "Avocado Toast",
                description: "Simple and healthy breakfast.",
                picture: "https://placehold.co/600x400?text=Avocado+Toast",
                ingredients: ["Bread", "Avocado", "Salt", "Lemon"],
                cookingTime: 5,
                servings: 1,
                tags: ["Breakfast", "Healthy"],
                instructions: ["Toast bread", "Mash avocado", "Spread on toast"]
            },
            {
                title: "Chocolate Cake",
                description: "Decadent and rich dessert.",
                picture: "https://placehold.co/600x400?text=Cake",
                ingredients: ["Flour", "Sugar", "Cocoa Powder", "Eggs"],
                cookingTime: 45,
                servings: 8,
                tags: ["Dessert", "Sweet"],
                instructions: ["Mix dry ingredients", "Add wet ingredients", "Bake at 180C"]
            }
        ];

        await db.collection(COLLECTION_NAME).insertMany(dummyRecipes);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Database seeded successfully!' }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to seed database' }));
    }
}

module.exports = { getAllRecipes, seedDatabase };
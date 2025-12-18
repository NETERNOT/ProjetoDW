const { getDatabase } = require('../database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'users';

// --- CONTROLLER FUNCTIONS ---

async function getAllUsers(req, res) {
    try {
        const db = getDatabase();
        // Fetch all documents from the 'users' collection
        const users = await db.collection(COLLECTION_NAME).find({}).toArray();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getAllUsers };
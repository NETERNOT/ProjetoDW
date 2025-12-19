require('dotenv').config();

const { MongoClient } = require('mongodb');
const DATABASE_NAME = 'mycookbook';
let databaseInstance = null;

async function connectToDatabase() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log('Successfully connected to MongoDB');
        databaseInstance = client.db(DATABASE_NAME);
        return databaseInstance;

    } catch (error) {

        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

function getDatabase() {
    if (!databaseInstance) {
        throw new Error('Call connectToDatabase() before requesting the database instance.');
    }
    return databaseInstance;
}

module.exports = { connectToDatabase, getDatabase };
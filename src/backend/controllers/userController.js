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

async function getUser(req, res, body){
    try{
        const db = getDatabase()
        const { id } = body
        const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
        if(user){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ user: { email: user.email, username: user.username, savedRecipes: user.savedRecipes } }));
        }else{
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "User not found" }));
        }
    }catch(error){
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({error:" Internal Server Error"}))
    }
}

async function checkEmailAvailability(req, res, body) {
    try {
        const db = getDatabase();
        const { email } = body;
        if (email === undefined) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ available: true }));
            return;
        }
        const user = await db.collection(COLLECTION_NAME).findOne({ email });
        const available = !user;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ available }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function checkUsernameAvailability(req, res, body) {
    try {
        const db = getDatabase();
        const { username } = body;
        if (username === undefined) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ available: true }));
            return;
        }
        const user = await db.collection(COLLECTION_NAME).findOne({ username });
        const available = !user;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ available }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function signup(req, res, body) {
    try {
        const db = getDatabase();
        const { email, username, password } = body;
        
        // Check availability
        const emailUser = await db.collection(COLLECTION_NAME).findOne({ email });
        const usernameUser = await db.collection(COLLECTION_NAME).findOne({ username });
        
        if (emailUser || usernameUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email or username already taken' }));
            return;
        }
        
        // Insert user
        const result = await db.collection(COLLECTION_NAME).insertOne({ username, email, password, savedRecipes: [] });
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created successfully', userId: result.insertedId }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function login(req, res, body) {
    try {
        const db = getDatabase();
        const { email, password } = body;

        const user = await db
            .collection(COLLECTION_NAME)
            .findOne({ email, password });
        
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid credentials' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}


module.exports = { getUser, getAllUsers, checkEmailAvailability, checkUsernameAvailability, signup, login };
const http = require('http');
const fileSystem = require('fs');
const path = require('path');

const { connectToDatabase } = require('./database');
// IMPORT THE CONTROLLER
const recipeController = require('./controllers/recipeController');
const userController = require('./controllers/userController');

const SERVER_PORT = 8000;
const FRONTEND_DIRECTORY_PATH = path.join(__dirname, '../frontend');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png', 
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer(async (incomingRequest, serverResponse) => {
    // 1. CORS HEADERS (Crucial for frontend to talk to backend)
    serverResponse.setHeader('Access-Control-Allow-Origin', '*');
    serverResponse.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    serverResponse.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight Request
    if (incomingRequest.method === 'OPTIONS') {
        serverResponse.writeHead(204);
        serverResponse.end();
        return;
    }

    const { url, method } = incomingRequest;

    let body = '';
    if (method === 'POST') {
        incomingRequest.on('data', chunk => {
            body += chunk.toString();
        });
        await new Promise(resolve => incomingRequest.on('end', resolve));
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = {};
        }
    }

    // 2. API ROUTING LOGIC
    if (url.startsWith('/api')) {
        
        if (url === '/api/recipes' && method === 'GET') {
            return recipeController.getAllRecipes(incomingRequest, serverResponse);
        }
        
        if (url === '/api/seed' && method === 'GET') {
            return recipeController.seedDatabase(incomingRequest, serverResponse);
        }

        if (url === '/api/users' && method === 'GET') {
            return userController.getAllUsers(incomingRequest, serverResponse);
        }

        if (url === '/api/check-email' && method === 'POST') {
            return userController.checkEmailAvailability(incomingRequest, serverResponse, body);
        }

        if (url === '/api/check-username' && method === 'POST') {
            return userController.checkUsernameAvailability(incomingRequest, serverResponse, body);
        }

        if (url === '/api/signup' && method === 'POST') {
            return userController.signup(incomingRequest, serverResponse, body);
        }

        if (url === '/api/login' && method === 'POST') {
            return userController.login(incomingRequest, serverResponse, body);
        }

        // API 404
        serverResponse.writeHead(404, { 'Content-Type': 'application/json' });
        serverResponse.end(JSON.stringify({ message: 'API Route not found' }));
        return;
    }

    // 3. STATIC FILE SERVING (Your existing logic)
    let requestedFilePath = url === '/' ? 'index.html' : url;
    if (requestedFilePath.startsWith('/')) requestedFilePath = requestedFilePath.slice(1);
    
    const fullFilePath = path.join(FRONTEND_DIRECTORY_PATH, requestedFilePath);

    fileSystem.readFile(fullFilePath, (error, fileContent) => {
        if (error) {
            serverResponse.writeHead(404);
            serverResponse.end('File not found');
        } else {
            const extension = path.extname(fullFilePath);
            serverResponse.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'text/plain' });
            serverResponse.end(fileContent);
        }
    });
});

async function startServer() {
    try {
        await connectToDatabase();
        server.listen(SERVER_PORT, () => {
            console.log(`Online at http://localhost:${SERVER_PORT}`);
        });
    } catch (error) {
        console.error('Critical Error:', error);
    }
}

startServer();
const http = require('http');
const fileSystem = require('fs');
const path = require('path');
const PORT = 8000

const { connectToDatabase } = require('./database');
const recipeController = require('./controllers/recipeController');
const userController = require('./controllers/userController');
const commentsController = require('./controllers/commentsController');

const SERVER_PORT = PORT || 8000;
const FRONTEND_DIRECTORY_PATH = path.join(__dirname, '../frontend');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.jsx': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer(async (incomingRequest, serverResponse) => {

    serverResponse.setHeader('Access-Control-Allow-Origin', '*');
    serverResponse.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    serverResponse.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    if (url.startsWith('/api')) {
        if (url === '/api/getUserId' && method === 'POST') {
            return userController.getUserId(incomingRequest, serverResponse, body);
        }

        if (url === '/api/getUser' && method === 'POST') {
            return userController.getUser(incomingRequest, serverResponse, body)
        }

        if (url === '/api/recipes' && method === 'GET') {
            return recipeController.getAllRecipes(incomingRequest, serverResponse);
        }

        if (url === '/api/recipes' && method === 'POST') {
            return recipeController.createRecipe(incomingRequest, serverResponse, body);
        }

        if (url === '/api/tags' && method === 'GET') {
            return recipeController.getTags(incomingRequest, serverResponse);
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

        if (url.startsWith('/api/comments') && method === 'GET') {
            return commentsController.getAllComments(incomingRequest, serverResponse);
        }

        if (url === '/api/comments' && method === 'POST') {
            return commentsController.createComment(incomingRequest, serverResponse, body);
        }

        if (url === '/api/toggleSavedRecipe' && method === 'POST') {
            return userController.toggleSavedRecipe(incomingRequest, serverResponse, body);
        }

        if (url === '/api/recipesById' && method === 'POST') {
            return recipeController.getRecipesById(incomingRequest, serverResponse, body);
        }

        if (url === '/api/getRecipesByCreator' && method === 'POST') {
            return recipeController.getRecipesByCreator(incomingRequest, serverResponse, body);
        }

        serverResponse.writeHead(404, { 'Content-Type': 'application/json' });
        serverResponse.end(JSON.stringify({ message: 'API Route not found' }));
        return;
    }

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
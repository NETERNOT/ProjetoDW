const http = require('http');
const fileSystem = require('fs');
const path = require('path');

require('dotenv').config();

const { connectToDatabase } = require('./database');
const recipeController = require('./controllers/recipeController');

const SERVER_PORT = process.env.PORT || 8000;
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

    if (url.startsWith('/api')) {
        
        if (url === '/api/recipes' && method === 'GET') {
            return recipeController.getAllRecipes(incomingRequest, serverResponse);
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
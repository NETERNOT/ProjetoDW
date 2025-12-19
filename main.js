const { app, BrowserWindow } = require('electron');

function createMainWindow() {

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "MyCookBook",
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#00000000',
            symbolColor: '#333333',
            height: 40,
        },
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const url = 'http://localhost:8000';

    const loadContent = () => {
        mainWindow.loadURL(url).catch((err) => {
            console.log(`Server not ready. Retrying...`);
            setTimeout(loadContent, 1000);
        });
    };

    loadContent();
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
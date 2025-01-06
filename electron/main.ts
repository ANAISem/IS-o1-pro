import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const devURL = 'http://localhost:5173';
const prodURL = `file://${path.join(__dirname, '../renderer/index.html')}`;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (isDev) {
    win.loadURL(devURL);
    win.webContents.openDevTools();
    console.log('Development mode - loading:', devURL);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
    console.log('Production mode - loading:', prodURL);
  }

  return win;
}

app.whenReady().then(() => {
  console.log('Electron app is ready');
  const mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

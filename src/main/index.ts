import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow: BrowserWindow;

function handleIPC() {
  ipcMain.handle('notification', async (_, { body, title, actions, closeButtonText }) => {
    let actionResult = await new Promise((resolve) => {
      let notification = new Notification({
        title,
        body,
        actions,
        closeButtonText,
      });
      notification.on('action', function (event) {
        resolve({ event: 'action' });
      });
      notification.on('close', function (event) {
        resolve({ event: 'close' });
      });
      notification.show();
    });
    return actionResult;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 250,
    height: 350,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }

  return mainWindow;
}

app.whenReady().then(() => {
  handleIPC();
  createMainWindow();
});

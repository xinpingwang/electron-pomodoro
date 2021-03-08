import { app, BrowserWindow, ipcMain, nativeImage, Notification } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

import { TrayApp } from './tray-app';

const isDevelopment = process.env.NODE_ENV !== 'production';

let tray: TrayApp;

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

function createTray() {
  let trayImage = nativeImage.createFromPath(path.join(__dirname, '../assets/images/icon.png'));
  let trayWindow = new BrowserWindow({
    width: 250,
    height: 350,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    trayWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    trayWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }
  tray = new TrayApp(trayImage, trayWindow);
}

app.whenReady().then(() => {
  handleIPC();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray.destroy();
    app.quit();
  }
});

app.dock.hide();

const { app, BrowserWindow, ipcMain, Notification } = require('electron');

let mainWindow;

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
  mainWindow.loadFile('./src/index.html');

  return mainWindow;
}

app.whenReady().then(() => {
  handleIPC();
  createMainWindow();
});

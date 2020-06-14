const { app, BrowserWindow, Notification, ipcMain } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('./src/index.html');
  handleIPC();
});

function handleIPC() {
  ipcMain.handle('work.notification', async () => {
    let res = await new Promise((resolve, reject) => {
      let notification = new Notification({
        title: '任务结束',
        body: '是否开始休息',
        actions: [{ text: '开始休息', type: 'button' }],
        closeButtonText: '继续工作',
      });
      notification.on('action', () => {
        resolve('rest');
      });
      notification.on('close', () => {
        resolve('work');
      });
      notification.show();
    });
    return res;
  });
}

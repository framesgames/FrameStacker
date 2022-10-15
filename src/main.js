const { app, BrowserWindow } = require('electron');
const path = require('path')

const createWindow = () => {
  const window = new BrowserWindow({
    fullscreen: true,
  })
  window.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})




const { app, BrowserWindow } = require('electron');
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const isDevelopment = !app.isPackaged;
const serverPort = 9003;
let nextServer;

function waitForServer(url, attempts = 50) {
  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
      });
      request.on('error', retry);
      request.setTimeout(500, () => request.destroy());
    };

    const retry = () => {
      if (attempts <= 0) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      attempts -= 1;
      setTimeout(check, 200);
    };

    check();
  });
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 700,
    title: 'FlowCraft',
    backgroundColor: '#0f172a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDevelopment) {
    await window.loadURL('http://localhost:9002');
    return;
  }

  const standalonePath = path.join(process.resourcesPath, 'app', '.next', 'standalone');
  nextServer = spawn(process.execPath, [path.join(standalonePath, 'server.js')], {
    cwd: standalonePath,
    env: { ...process.env, PORT: String(serverPort), HOSTNAME: '127.0.0.1' },
    windowsHide: true,
  });
  nextServer.on('error', (error) => console.error('Failed to start Next.js:', error));

  const url = `http://127.0.0.1:${serverPort}`;
  await waitForServer(url);
  await window.loadURL(url);
}

app.whenReady().then(async () => {
  try {
    await createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (nextServer) nextServer.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextServer) nextServer.kill();
});

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow = null
let pythonProcess = null
const BACKEND_PORT = 18923
const isDev = !app.isPackaged

// ============================================
// Python Backend Management
// ============================================

function startPythonBackend() {
  const fs = require('fs')
  const venvPython = path.join(__dirname, '..', '.venv', 'bin', 'python3')
  const pythonPath = isDev
    ? (fs.existsSync(venvPython) ? venvPython : 'python3')
    : path.join(process.resourcesPath, 'python', 'python3')
  const backendPath = isDev
    ? path.join(__dirname, '..', 'backend')
    : path.join(process.resourcesPath, 'backend')

  pythonProcess = spawn(pythonPath, [
    '-m', 'uvicorn',
    'app.main:app',
    '--host', '127.0.0.1',
    '--port', String(BACKEND_PORT),
    '--no-access-log',
  ], {
    cwd: backendPath,
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`)
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Backend] ${data.toString().trim()}`)
  })

  pythonProcess.on('close', (code) => {
    console.log(`[Backend] Process exited with code ${code}`)
    pythonProcess = null
  })

  pythonProcess.on('error', (err) => {
    console.error(`[Backend] Failed to start:`, err.message)
    pythonProcess = null
  })
}

function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.kill('SIGTERM')
    pythonProcess = null
  }
}

// ============================================
// Window Management
// ============================================

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Vaultix',
    icon: path.join(__dirname, '..', 'public', 'vaultix-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
    backgroundColor: '#0f172a',
  })

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Unsaved changes warning
  mainWindow.on('close', async (e) => {
    const isDirty = await mainWindow.webContents.executeJavaScript(
      'window.__vaultixIsDirty && window.__vaultixIsDirty()'
    ).catch(() => false)

    if (isDirty) {
      e.preventDefault()
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Speichern', 'Verwerfen', 'Abbrechen'],
        defaultId: 0,
        cancelId: 2,
        title: 'Ungespeicherte Änderungen',
        message: 'Die Datenbank hat ungespeicherte Änderungen.',
        detail: 'Möchten Sie vor dem Schließen speichern?',
      })

      if (response === 0) {
        // Save then close
        await mainWindow.webContents.executeJavaScript('window.__vaultixSave && window.__vaultixSave()')
        mainWindow.destroy()
      } else if (response === 1) {
        // Discard
        mainWindow.destroy()
      }
      // 2 = Cancel, do nothing
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Remove default menu in production
  if (!isDev) {
    Menu.setApplicationMenu(null)
  }
}

// ============================================
// IPC Handlers
// ============================================

ipcMain.handle('get-backend-url', () => {
  return `http://127.0.0.1:${BACKEND_PORT}`
})

ipcMain.handle('open-file-dialog', async (_event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options?.title || 'Datenbank öffnen',
    filters: options?.filters || [
      { name: 'KeePass Datenbank', extensions: ['kdbx'] },
      { name: 'Alle Dateien', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('save-file-dialog', async (_event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: options?.title || 'Datenbank speichern',
    filters: options?.filters || [
      { name: 'KeePass Datenbank', extensions: ['kdbx'] },
    ],
    defaultPath: options?.defaultPath,
  })
  return result.canceled ? null : result.filePath
})

ipcMain.handle('show-message-box', async (_event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options)
  return result.response
})

// ============================================
// App Lifecycle
// ============================================

app.whenReady().then(() => {
  startPythonBackend()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  stopPythonBackend()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopPythonBackend()
})

const { contextBridge, ipcRenderer } = require('electron')

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Backend URL
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),

  // File dialogs
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),

  // Message boxes
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),

  // Platform info
  platform: process.platform,
  isElectron: true,
})

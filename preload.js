// const { contextBridge, ipcRenderer } = require('electron');

// // Expose protected methods that allow the renderer process to use
// // the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('electronAPI', {
//   // Existing project creation APIs
//   selectFolder: () => ipcRenderer.invoke('select-folder'),
//   installProject: (projectData) => ipcRenderer.invoke('install-project', projectData),
//   openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  
//   // Window control APIs
//   closeApp: () => ipcRenderer.invoke('close-app'),
//   minimizeApp: () => ipcRenderer.invoke('minimize-app'),
//   maximizeApp: () => ipcRenderer.invoke('maximize-app'),
  
//   // New package management APIs
//   copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
//   openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
//   // Listen for install progress
//   // onInstallProgress: (callback) => ipcRenderer.on('install-progress', callback),
//   // removeInstallProgressListener: (callback) => ipcRenderer.removeListener('install-progress', callback)
//   // ...existing code...
//   onInstallProgress: (callback) => ipcRenderer.on('install-progress', (event, data) => callback(data)),
//   removeInstallProgressListener: (callback) => ipcRenderer.removeListener('install-progress', callback)
//   // ...existing code...
// });


const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Existing project creation APIs
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  installProject: (projectData) => ipcRenderer.invoke('install-project', projectData),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
 
  // Window control APIs
  closeApp: () => ipcRenderer.invoke('close-app'),
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
  maximizeApp: () => ipcRenderer.invoke('maximize-app'),
 
  // Package management APIs
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // System APIs - ADD THESE
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getDefaultPath: () => ipcRenderer.invoke('get-default-path'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  openInEditor: (projectPath) => ipcRenderer.invoke('open-in-editor', projectPath),
 
  // Install progress listeners
  onInstallProgress: (callback) => ipcRenderer.on('install-progress', (event, data) => callback(data)),
  removeInstallProgressListener: (callback) => ipcRenderer.removeListener('install-progress', callback)
});
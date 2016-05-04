import Ember from 'ember';

/**
 * Functions
 */

/**
 * Reloads the currently focused window
 *
 * @export
 * @param item - The menu item calling
 * @param {Electron.BrowserWindow} focusedWindow - The currently focussed window
 */
export function reload(item, focusedWindow) {
    if (focusedWindow) {
        focusedWindow.reload();
    }
};

/**
 * Toggles fullscreen on the currently focused window
 *
 * @export
 * @param item (description) * @param item - The menu item calling
 * @param {Electron.BrowserWindow} focusedWindow - The currently focussed window focusedWindow (description)
 */
export function toggleFullscreen(item, focusedWindow) {
    if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    }
};

/**
 * Toggles the developer tools on the currently focused window
 *
 * @export
 * @param item - The menu item calling
 * @param {Electron.BrowserWindow} focusedWindow - The currently focussed window
 */
export function toggleDevTools(item, focusedWindow) {
    if (focusedWindow) {
        focusedWindow.toggleDevTools();
    }
};

/**
 * Attempts to toggle developer tools for the currently visible Ghost instance
 *
 * @export
 * @param item - The menu item calling
 * @param {Electron.BrowserWindow} focusedWindow - The currently focussed window
 */
export function toggleGhostDevTools(item, focusedWindow) {
    if (focusedWindow) {
        let host = Ember.$('div.instance-host.selected');
        let webviews = host ? Ember.$(host).find('webview') : null;

        if (!webviews || !webviews[0]) {
            return;
        }

        if (webviews[0].isDevToolsOpened()) {
            webviews[0].closeDevTools();
        } else {
            webviews[0].openDevTools();
        }
    }
}

/**
 * Opens the issues on GitHub in the OS default browser
 *
 * @export
 */
export function openReportIssues() {
    requireNode('electron').shell.openExternal('https://github.com/ajainvivek/P2PDrop/issues');
}

/**
 * Opens the repository on GitHub in the OS default browser
 *
 * @export
 */
export function openRepository() {
    requireNode('electron').shell.openExternal('https://github.com/ajainvivek/P2PDrop');
}

/**
 * Setups the window menu for the application
 *
 * @export
 * @returns {Electron.Menu} - Built Menu
 */
export function setup() {
    let {remote} = requireNode('electron');
    let {Menu, app} = remote;
    let template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    /**
                     * (description)
                     *
                     * @param item (description)
                     * @param focusedWindow (description)
                     */
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11',
                    click: toggleFullscreen
                }
            ]
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: toggleDevTools
                },
                {
                    label: 'Toggle Developer Tools (Current Blog)',
                    accelerator: (process.platform === 'darwin') ? 'Alt+Command+Shift+I' : 'Ctrl+Alt+Shift+I',
                    click: toggleGhostDevTools
                },
                {
                    label: 'Repository',
                    click: openRepository
                },
                {
                    label: 'Report Issues',
                    click: openReportIssues
                }
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: openRepository
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: 'Ghost',
            submenu: [
                {
                    label: 'About P2PDrop',
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: `Hide ${name}`,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        });
    }

    let builtMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(builtMenu);
    return builtMenu;
}

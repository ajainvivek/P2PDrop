/**
 * Handles the contextmenu event for the whole window, checking if
 * an input element has been selected - if so, a cut/copy/paste
 * menu will be opened
 *
 * @param e - MouseEvent
 */
function handleContextMenu(e) {
    let {remote} = requireNode('electron');
    let {BrowserWindow, Menu} = remote;
    let template = [{
            label: 'Undo',
            role: 'undo'
        }, {
            label: 'Redo',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            role: 'cut'
        }, {
            label: 'Copy',
            role: 'copy'
        }, {
            label: 'Paste',
            role: 'paste'
        }, {
            label: 'Paste and Match Style',
            click: () => BrowserWindow.getFocusedWindow().webContents.pasteAndMatchStyle()
        }, {
            label: 'Select All',
            role: 'selectall'
        }];

    e.preventDefault();
    e.stopPropagation();

    let node = e.target;
    let editorMenu = Menu.buildFromTemplate(template);

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            editorMenu.popup(remote.getCurrentWindow());
            break;
        }

        node = node.parentNode;
    }

    /**
     * We cannot, with pure JavaScript, confirm that this event handler works.
     * A little hack to ensure that this method becomes testable.
     */
    if (window && window.QUnit && editorMenu) {
        window.CONTEXTMENU_OPENED = true;
    }
}

/**
 * Creates the conextmenu event listener
 *
 * @export
 */
export function setup() {
    window.addEventListener('contextmenu', handleContextMenu);
};

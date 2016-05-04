'use strict';
/**
 * This file is responsible for handling Squirrel events.
 * ⚠ Remember: It needs to load ASAP, execute ASAP, exit ASAP! ⚠
 */

const path        = require('path');
const spawn       = require('child_process').spawn;
const app         = require('app');

function run(args, done) {
    let updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');

    spawn(updateExe, args, {
        detached: true
    }).on('close', done);
};

const check = function() {
    if (process.platform === 'win32') {
        let cmd = process.argv[1];
        let target = path.basename(process.execPath);

        if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
            run(['--createShortcut=' + target + ''], app.quit);
            return true;
        }

        if (cmd === '--squirrel-uninstall') {
            run(['--removeShortcut=' + target + ''], app.quit);
            return true;
        }

        if (cmd === '--squirrel-obsolete') {
            app.quit();
            return true;
        }

        if (cmd === '--squirrel-updated') {
            app.quit();
            return true;
        }
    }
    return false;
};

module.exports = check;

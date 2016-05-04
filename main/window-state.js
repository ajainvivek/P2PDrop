'use strict';
const electron = require('electron');
const winStateKeeper = require('electron-window-state');

/**
 * This file provides basic window state management
 */

/**
 * Builds an returns an object consisting of two objects, with the following keys:
 * usableState: an object describing how to layout the app window given screen real estate
 * stateKeeper: an object that keeps track of window state change events.
 */
function fetchWindowState() {
    const screen = electron.screen;
    const defaultWidth = 1000;
    const defaultHeight = 800;

    // Instantiate the state keeper with a default state.
    const stateKeeper = winStateKeeper({
        defaultWidth: defaultWidth,
        defaultHeight: defaultHeight
    });

    // Get the display nearest to the window's saved position, if it exists.
    const nearestDisplay = screen.getDisplayNearestPoint({
        x: stateKeeper.x,
        y: stateKeeper.y
    });

    // Get the usable screen area.
    const displaySize = nearestDisplay.workAreaSize;

    // Build an object consisting of window offset, usable width/height, and
    // usable minWidth/minHeight.
    // We want to avoid the following situations:
    //  1. the *minimum* width/height larger than the usable screen estate
    //  2. the window width/height larger than the usable screen real estate.
    const usableState = {
        x: stateKeeper.x,
        y: stateKeeper.y,
        width: displaySize.width < stateKeeper.width ? displaySize.width : stateKeeper.width,
        height: displaySize.height < stateKeeper.height ? displaySize.height : stateKeeper.height,
        minWidth: displaySize.width < defaultWidth ? displaySize.width : defaultWidth,
        minHeight: displaySize.height < defaultHeight ? displaySize.height : defaultHeight
    };

    return {
        usableState: usableState,
        stateKeeper: stateKeeper
    };
};

module.exports = fetchWindowState;

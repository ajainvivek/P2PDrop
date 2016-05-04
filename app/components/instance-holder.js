import Ember from 'ember';
import config from '../config/environment';
import contextMenu from '../utils/context-menu';
import windowMenu from '../utils/window-menu';

export default Ember.Component.extend({
  setup : function () {
    if (config.isDesktop) {
      contextMenu.setup();
      windowMenu.setup();
    }
  }.on("didInsertElement")
});

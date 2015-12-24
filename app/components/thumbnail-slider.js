import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  files: [],
  didInsertElement : function () {
    let self = this;
    let files = this.get("files");
    let guid;

    p2p.pubsub.subscribe("p2p-file-incoming", this, function (metadata) {
      guid = self.guid();
      let file = Ember.Object.create({
        name: metadata.name,
        guid: guid,
        url: "",
        selected: false
      });
      files.pushObject(file);
      self.set("files", files);
    });

    p2p.pubsub.subscribe("p2p-file-received", this, function (file) {
      let changedFile = files.findProperty("guid", guid);
      changedFile.set("url", URL.createObjectURL(file));
      p2p.pubsub.publish("notify-action-bar", changedFile);
      self.highlightSelected(guid);
    });
  },

  guid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },

  highlightSelected: function (guid) {
    let files = this.get("files");
    let prevFile = files.findProperty("selected", true);
    if (prevFile) {
      prevFile.set("selected", false);
    }
    let changedFile = files.findProperty("guid", guid);
    changedFile.set("selected", true);
  },

  actions : {
    triggerActionBar : function (data) {
      this.highlightSelected(data.guid);
      p2p.pubsub.publish("notify-action-bar", data);
    }
  }
});

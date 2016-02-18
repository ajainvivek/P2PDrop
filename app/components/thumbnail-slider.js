import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  files: [],
  currentGUID: null,
  didInsertElement : function () {
    this.set("thumbnailContext", this);
    this.highlightSelected();
  },

  //once file metadata is received render the card
  renderCard : function (metadata) {
    let files = this.get("files");
    let guid = this.guid();
    this.set("currentGUID", guid);
    let file = Ember.Object.create({
      name: metadata.name,
      guid: guid,
      url: "",
      selected: false
    });
    files.pushObject(file);
    this.set("files", files);
  },

  //once file is downloaded append to anchor tag to download the file
  appendFile : function (file, callback) {
    let files = this.get("files");
    let guid = this.get("currentGUID");
    let changedFile = files.findProperty("guid", guid);
    let self = this;
    file.getBlobURL(function (err, url) {
      if (err) {
        throw err;
      }
      changedFile.set("url", url);
      self.highlightSelected(guid);
      callback(changedFile);
    });
  },

  //generate guid
  guid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },

  //highlight the selected file
  highlightSelected: function (guid) {
    let files = this.get("files");
    let prevFile = files.findProperty("selected", true);
    if (prevFile) {
      prevFile.set("selected", false);
    }
    if (guid) {
      let changedFile = files.findProperty("guid", guid);
      changedFile.set("selected", true);
    }
  },

  actions : {
    triggerActionBar : function (data) {
      this.highlightSelected(data.guid);
      this.sendAction("fileChange", data);
    }
  }
});

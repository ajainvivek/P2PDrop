import Ember from "ember";
import config from '../../config/environment';

const {
  Controller,
  Logger,
  inject
} = Ember;

export default Controller.extend({
  sidebar: inject.controller("home.sidebar"),
  webtorrent : inject.service(),
  webrtc : inject.service(),
  users : inject.service("users"),
  blob : inject.service("blob"),
  notify : inject.service("notify"),
  init : function () {
    let webrtc = this.get("webrtc");
    let webtorrent = this.get("webtorrent");
    let self = this;
    const uid = this.get('session.secure.uid');

    //Initialize
    this.get("webrtc").initialize();

    //Render thumbnail card
    let renderCard = function (torrent, name) {
      let thumbnailContext = self.get("thumbnailContext");
      thumbnailContext.renderCard.call(thumbnailContext, torrent, name);
    };

    //Default Join Self Room To Receive Incoming Files
    webrtc.joinRoom(uid);

    webrtc.onMessageReceived(function (data) {
      webtorrent.download(data.payload.message, renderCard).then(function (file) {
        let thumbnailContext = self.get("thumbnailContext");
        let actionContext = self.get("actionContext");
        thumbnailContext.appendFile.call(thumbnailContext, file[0], actionContext.notifyFileSelect.bind(actionContext));
      });
    });
  },
  actions : {
    triggerFileSelect : function (callback) {
      let selectedList = this.get("sidebar").selectedList;
      let notify = this.get("notify");
      if (selectedList !== null) {
        callback();
      } else {
        notify.info("Select user to share file.");
      }
    },
    sendFile : function (data) {
      let webtorrent = this.get("webtorrent");
      let webrtc = this.get("webrtc");
      let instance = this.get("sidebar").webrtcInstance;
      let fileObj;
      let users = this.get("users");
      const uid = this.get('session.secure.uid');

      if (config.locationType === "hash") { //Hack To Seed File Object for WebTorrent
        let base64 = data[0].result.split(',')[1];
        let blob = this.get("blob");
        fileObj = blob.b64toBlob(base64, data[0].file.type);
        fileObj.name = data[0].file.name;
        fileObj.lastModified = data[0].file.lastModified;
        fileObj.lastModifiedDate = data[0].file.lastModifiedDate;
        fileObj.webkitRelativePath = data[0].file.webkitRelativePath;
      } else {
        fileObj = data[0].file;
      }

      webtorrent.seed(fileObj).then(function (hash) {

        users.getCurrentUser(uid).then(function (user) {
          let obj = {
            hash : hash,
            name : user.name
          };
          webrtc.sendChatMessage(obj, instance);
        });

      }, function () {
        Logger.debug("error state");
      });
    },
    changeSelectedFile : function (file) {
      let thumbnailContext = this.get("thumbnailContext");
      let actionContext = this.get("actionContext");
      thumbnailContext.appendFile.call(thumbnailContext, file, actionContext.notifyFileSelect.bind(actionContext));
    }
  }
});

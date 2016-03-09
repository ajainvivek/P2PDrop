import Ember from "ember";

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
  init : function () {
    let webrtc = this.get("webrtc");
    let webtorrent = this.get("webtorrent");
    let self = this;
    const uid = this.get('session.secure.uid');

    //Initialize
    this.get("webrtc").initialize();

    //Render thumbnail card
    let renderCard = function (torrent) {
      let thumbnailContext = self.get("thumbnailContext");
      thumbnailContext.renderCard.call(thumbnailContext, torrent);
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
    sendFile : function (data) {
      let webtorrent = this.get("webtorrent");
      let webrtc = this.get("webrtc");
      let instance = this.get("sidebar").webrtcInstance;
      webtorrent.seed(data[0].file).then(function (hash) {
        webrtc.sendChatMessage(hash, instance);
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

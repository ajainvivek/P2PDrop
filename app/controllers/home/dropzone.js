import Ember from "ember";

const {
  Controller,
  Logger,
  inject
} = Ember;

export default Controller.extend({
  webtorrent : inject.service(),
  webrtc : inject.service(),
  init : function () {
    let webrtc = this.get("webrtc");
    let webtorrent = this.get("webtorrent");
    let self = this;

    //Initialize
    this.get("webrtc").initialize();

    //Render thumbnail card
    let renderCard = function (torrent) {
      let thumbnailContext = self.get("thumbnailContext");
      thumbnailContext.renderCard.call(thumbnailContext, torrent);
    };

    webrtc.joinRoom("test");
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
      webtorrent.seed(data[0].file).then(function (hash) {
        webrtc.sendChatMessage(hash);
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

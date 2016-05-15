import Ember from "ember";
import config from '../../config/environment';
import PrettyBytes from '../../mixins/pretty-bytes';

const {
  Controller,
  run,
  Logger,
  inject
} = Ember;

export default Controller.extend(PrettyBytes, {
  sidebar: inject.controller("home.sidebar"),
  webtorrent : inject.service(),
  webrtc : inject.service(),
  users : inject.service("users"),
  blob : inject.service("blob"),
  notify : inject.service("notify"),
  senderName : "Anonymous",
  modalContext : {},
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
      self.set("senderName", data.payload.message.name);
      self.get("modalContext").open(function () {
        webtorrent.download(data.payload.message, renderCard).then(function (file) {
          let thumbnailContext = self.get("thumbnailContext");
          let actionContext = self.get("actionContext");
          thumbnailContext.appendFile.call(thumbnailContext, file[0], actionContext.notifyFileSelect.bind(actionContext));
        });
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
      let self = this;
      let notify = this.get("notify");
      const uid = this.get('session.secure.uid');

      if (config.isDesktop) { //Hack To Seed File Object for WebTorrent
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

      webtorrent.seed(fileObj).then(function (torrent) {

        // let progressInfo = '<b>Waiting for user to accept file.</b><br><br> '
        // + '<b>File Name:</b> ' + torrent.name + '<br> '
        // + '<b>Total Size:</b> ' + self.prettyBytes(torrent.info.length)  + '<br> '
        // + '<b>Peers:</b> ' + torrent.numPeers + '<br> '
        // + '<b>Download speed:</b> ' + self.prettyBytes(torrent.client.downloadSpeed) + '/s  <br>' +
        // '<b>Upload speed:</b> ' + self.prettyBytes(torrent.client.uploadSpeed) + '/s';
        //
        // let progressInfoNotify = notify.info({ html: progressInfo , closeAfter: null});
        //
        // torrent.on('upload', function (bytes) {
        //   progressInfo = '<b>File Name:</b> ' + torrent.name + '<br> '
        //   + '<b>Total Size:</b> ' + self.prettyBytes(torrent.info.length)  + '<br> '
        //   + '<b>Peers:</b> ' + torrent.numPeers + '<br> '
        //   + '<b>Download speed:</b> ' + self.prettyBytes(torrent.client.downloadSpeed) + '/s  <br>' +
        //   '<b>Upload speed:</b> ' + self.prettyBytes(torrent.client.uploadSpeed) + '/s';
        //   let updateSpeed = function () {
        //     progressInfoNotify.set("html", progressInfo);
        //     let progress = Math.round((100 * torrent.client.progress).toFixed(1))
        //     if (parseInt(progress) === 100) {
        //       progressInfoNotify.set("visible", false);
        //       run.cancel(throttle);
        //     }
        //   };
        //   let throttle = run.throttle(self, updateSpeed, 10);
        // });

        users.getCurrentUser(uid).then(function (user) {
          let obj = {
            hash : torrent.infoHash,
            magnetURI : torrent.magnetURI,
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
      actionContext.notifyFileSelect.call(actionContext, file);
    },
    resetSelected : function (boolean) {
      let actionContext = this.get("actionContext");
      actionContext.resetSelected(boolean);
    }
  }
});

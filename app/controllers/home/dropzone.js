import Ember from "ember";

const {
  Controller,
  Logger,
  inject
} = Ember;

export default Controller.extend({
  webtorrent : inject.service(),
  init : function () {
    // var webrtc = this.get("webrtc");
    // //Initialize
    // this.get("webrtc").initialize();

    // webrtc.joinRoom();

    // webrtc.createPeer(function (metadata, receiver) {
    //   console.log('incoming filetransfer', metadata.name, metadata);

    //   p2p.pubsub.publish("p2p-file-incoming", metadata);

    //   receiver.on('progress', function (bytesReceived) {
    //       p2p.pubsub.publish("p2p-file-inprogress", {
    //         bytesReceived: bytesReceived,
    //         size: metadata.size
    //       });
    //       console.log('receive progress', bytesReceived, 'out of', metadata.size);
    //   });

    //   // get notified when file is done
    //   receiver.on('receivedFile', function (file, metadata) {
    //       console.log('received file', metadata.name, metadata.size);
    //       p2p.pubsub.publish("p2p-file-received", file);
    //       // close the channel
    //       receiver.channel.close();
    //   });
    // });
  },
  actions : {
    sendFile : function (data) {
      var webtorrent = this.get("webtorrent");
      webtorrent.seed(data[0].file).then(function (hash) {
        Logger.debug(hash);
        webtorrent.download(hash).then(function (file) {
          file[0].appendTo('body');
        });
      }, function () {
        Logger.debug("error state");
      });
    }
  }
});

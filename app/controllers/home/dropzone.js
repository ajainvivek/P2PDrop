import Ember from "ember";
var inject = Ember.inject;

export default Ember.Controller.extend({
  swebrtc : inject.service(),
  init : function () {
    var webrtc = this.get("swebrtc");
    //Initialize
    this.get("swebrtc").initialize();

    webrtc.joinRoom();

    webrtc.createPeer(function (metadata, receiver) {
      console.log('incoming filetransfer', metadata.name, metadata);

      p2p.pubsub.publish("p2p-file-incoming", metadata);

      receiver.on('progress', function (bytesReceived) {
          p2p.pubsub.publish("p2p-file-inprogress", {
            bytesReceived: bytesReceived,
            size: metadata.size
          });
          console.log('receive progress', bytesReceived, 'out of', metadata.size);
      });

      // get notified when file is done
      receiver.on('receivedFile', function (file, metadata) {
          console.log(file.type);
          console.log('received file', metadata.name, metadata.size);
          p2p.pubsub.publish("p2p-file-received", file);
          // close the channel
          receiver.channel.close();
      });
    });
  }
});

/**** Simple WebRTC Implementation ******/

import Ember from "ember";

export default Ember.Service.extend({
  filetransfer: null,
  peer: null,
  initialize : function () {
    this.set("filetransfer", new SimpleWebRTC({
        // we don't do video
        localVideoEl: '',
        remoteVideosEl: '',
        // dont ask for camera access
        autoRequestMedia: false,
        // dont negotiate media
        receiveMedia: {
            mandatory: {
                OfferToReceiveAudio: false,
                OfferToReceiveVideo: false
            }
        }
    }));
  },

  //Join Room
  joinRoom: function () {
    var filetransfer = this.get("filetransfer");
    filetransfer.joinRoom('test');
  },

  //Create Peer
  createPeer: function (callback) {
    var self = this;
    var filetransfer = this.get("filetransfer");
    // Called when a peer is created
    filetransfer.on('createdPeer', function (peer) {
        self.set("peer", peer);
        // receiving an incoming filetransfer
        peer.on('fileTransfer', function (metadata, receiver) {
            callback(metadata, receiver);
        });
    });
  },

  //On File Transfer
  onErrorState: function (callback) {
    var filetransfer = this.get("filetransfer");

    // local p2p/ice failure
    filetransfer.on('iceFailed', function (peer) {
        callback('Connection failed.');
    });

    // remote p2p/ice failure
    filetransfer.on('connectivityError', function (peer) {
        callback('Connection remote fail');
    });
  },

  //Send File
  sendFile: function (file) {
    var peer = this.get("peer");
    peer.sendFile(file);
  }

});

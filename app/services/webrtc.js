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
        },
        url: "https://p2pdrop-signalling.herokuapp.com/"
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

        //TODO: Move to status bar while sending file disable file input once completed enable
        // show the ice connection state
        if (peer && peer.pc) {
            peer.pc.on('iceConnectionStateChange', function (event) {
                var state = peer.pc.iceConnectionState;
                console.log('state', state);
                switch (state) {
                  case 'checking':
                      Ember.Logger.log('Connecting to peer...');
                      break;
                  case 'connected':
                  case 'completed': // on caller side
                      Ember.Logger.log('Connection established.');
                      break;
                  case 'disconnected':
                      Ember.Logger.log('Disconnected.');
                      break;
                  case 'failed':
                      // not handled here
                      break;
                  case 'closed':
                      Ember.Logger.log('Connection closed.');

                      // disable file sending
                      // FIXME: remove container, but when?
                      break;
                }
            });
        }

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
    var sender = peer.sendFile(file);

    // hook up send progress
    sender.on('progress', function (bytesSent) {
        Ember.Logger.log(bytesSent);
    });
    // sending done
    sender.on('sentFile', function () {
        Ember.Logger.log("File Sent");
        //enable file attribute after file is sent
    });
    // receiver has actually received the file
    sender.on('complete', function () {
        // safe to disconnect now
    });
  }

});

/**** Simple WebRTC Implementation ******/

import Ember from "ember";

export default Ember.Service.extend({
  webrtc: null,
  peer: null,
  initialize : function () {
    this.set("webrtc", new SimpleWebRTC({
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

  //Get WebRTC Instance
  getInstance : function () {
    return new SimpleWebRTC({
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
    });
  },

  //On message received
  onMessageReceived : function (callback) {
    var webrtc = this.get("webrtc");
    webrtc.connection.on('message', function(data){
      if(data.type === 'chat'){
        console.log('chat received',data);
        callback(data);
      }
    });
  },

  //Send chat message
  sendChatMessage : function (msg, webrtc) {
    var webrtc = webrtc || this.get("webrtc");
    webrtc.sendToAll('chat', {message: msg, nick: webrtc.config.nick});
  },

  //Join Room
  joinRoom: function (room, webrtc) {
    var webrtc = webrtc || this.get("webrtc");
    webrtc.joinRoom(room);
  },

  //Create Peer
  createPeer: function (callback, webrtc) {
    var self = this;
    var webrtc = webrtc || this.get("webrtc");
    // Called when a peer is created
    webrtc.on('createdPeer', function (peer) {
        self.set("peer", peer);
        // receiving an incoming webrtc
        peer.on('webrtc', function (metadata, receiver) {
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
    var webrtc = this.get("webrtc");

    // local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        callback('Connection failed.');
    });

    // remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
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

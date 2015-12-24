import Ember from 'ember';

export default Ember.Service.extend({

  sharedKey : "p2pdrop-key",       // Unique identifier for two clients to find each other
  remote : null,          // ID of the remote peer -- set once they send an offer
  peerConnection : null,  // This is our WebRTC connection
  dataChannel : null,     // This is our outgoing data channel within WebRTC
  running : false,        // Keep track of our connection state
  file : null, //File to be shared

  // Use Google's public servers for STUN
  // STUN is a component of the actual WebRTC connection
  servers : {
    iceServers: [{
      url:'stun:23.21.150.121'
    },{
      url : 'stun:stun.l.google.com:19302'
    }]
  },

  id : Math.random().toString().replace('.', ''),

  initialize : function (file) {
    // Configure, connect, and set up Firebase
    // You probably want to replace the text below with your own Firebase URL
    const firebaseUrl = 'https://p2pdrop.firebaseio.com/';

    this.file = file;

    this.database = new Firebase(firebaseUrl);
    this.announceChannel = this.database.child('announce');
    this.signalChannel = this.database.child('messages').child(this.id);
    this.signalChannel.on('child_added', this.handleSignalChannelMessage.bind(this));
    this.announceChannel.on('child_added', this.handleAnnounceChannelMessage.bind(this));

    // Send a message to the announcement channel
    // If our partner is already waiting, they will send us a WebRTC offer
    // over our Firebase signalling channel and we can begin delegating WebRTC
    this.sendAnnounceChannelMessage();
  },

  // Generate this browser a unique ID
  // On Firebase peers use this unique ID to address messages to each other
  // after they have found each other in the announcement channel

  /* == Announcement Channel Functions ==
   * The 'announcement channel' allows clients to find each other on Firebase
   * These functions are for communicating through the announcement channel
   * This is part of the signalling server mechanism
   *
   * After two clients find each other on the announcement channel, they
   * can directly send messages to each other to negotiate a WebRTC connection
   */

  // Announce our arrival to the announcement channel
  sendAnnounceChannelMessage : function() {
    var self = this;
    this.announceChannel.remove(function() {
      self.announceChannel.push({
        sharedKey : self.sharedKey,
        id : self.id
      });
      console.log('Announced our sharedKey is ' + self.sharedKey);
      console.log('Announced our ID is ' + self.id);
    });
  },

  // Handle an incoming message on the announcement channel
  handleAnnounceChannelMessage : function(snapshot) {
    var message = snapshot.val();
    if (message.id != this.id && message.sharedKey === this.sharedKey) {
      console.log('Discovered matching announcement from ' + message.id);
      this.remote = message.id;
      this.initiateWebRTCState();
      this.connect();
    }
  },

  /* == Signal Channel Functions ==
   * The signal channels are used to delegate the WebRTC connection between
   * two peers once they have found each other via the announcement channel.
   *
   * This is done on Firebase as well. Once the two peers communicate the
   * necessary information to 'find' each other via WebRTC, the signalling
   * channel is no longer used and the connection becomes peer-to-peer.
   */

   // Send a message to the remote client via Firebase
   sendSignalChannelMessage : function(message) {
     message.sender = this.id;
     this.database.child('messages').child(this.remote).push(message);
   },

   // Handle a WebRTC offer request from a remote client
   handleOfferSignal : function(message) {
     var self = this;
     this.running = true;
     this.remote = message.sender;
     this.initiateWebRTCState();
     this.startSendingCandidates();
     this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
     this.peerConnection.createAnswer(function(sessionDescription) {
       console.log('Sending answer to ' + message.sender);
       self.peerConnection.setLocalDescription(sessionDescription);
       self.sendSignalChannelMessage(sessionDescription.toJSON());
     });
   },

   // Handle a WebRTC answer response to our offer we gave the remote client
   handleAnswerSignal : function(message) {
     this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
   },

   // Handle an ICE candidate notification from the remote client
   handleCandidateSignal : function(message) {
     var candidate = new RTCIceCandidate(message);
     this.peerConnection.addIceCandidate(candidate);
   },

   // This is the general handler for a message from our remote client
   // Determine what type of message it is, and call the appropriate handler
   handleSignalChannelMessage : function(snapshot) {
     var message = snapshot.val();
     var sender = message.sender;
     var type = message.type;
     console.log('Recieved a \'' + type + '\' signal from ' + sender);
     if (type == 'offer') this.handleOfferSignal(message);
     else if (type == 'answer') this.handleAnswerSignal(message);
     else if (type == 'candidate' && this.running) this.handleCandidateSignal(message);
   },

   /* == ICE Candidate Functions ==
    * ICE candidates are what will connect the two peers
    * Both peers must find a list of suitable candidates and exchange their list
    * We exchange this list over the signalling channel (Firebase)
    */

    // Add listener functions to ICE Candidate events
    startSendingCandidates: function() {
       this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChange.bind(this);
       this.peerConnection.onicecandidate = this.handleICECandidate.bind(this);
    },

   // This is how we determine when the WebRTC connection has ended
   // This is most likely because the other peer left the page
   handleICEConnectionStateChange : function() {
     if (this.peerConnection.iceConnectionState == 'disconnected') {
       console.log('Client disconnected!');
       this.sendAnnounceChannelMessage();
     }
   },

   // Handle ICE Candidate events by sending them to our remote
   // Send the ICE Candidates via the signal channel
   handleICECandidate : function(event) {
     var candidate = event.candidate;
     if (candidate) {
       candidate = candidate.toJSON();
       candidate.type = 'candidate';
       console.log('Sending candidate to ' + this.remote);
       this.sendSignalChannelMessage(candidate);
     } else {
       console.log('All candidates sent');
     }
   },

   /* == Data Channel Functions ==
    * The WebRTC connection is established by the time these functions run
    * The hard part is over, and these are the functions we really want to use
    *
    * The functions below relate to sending and receiving WebRTC messages over
    * the peer-to-peer data channels
    */

    // This is our receiving data channel event
    // We receive this channel when our peer opens a sending channel
    // We will bind to trigger a handler when an incoming message happens
    handleDataChannel : function(event) {
      event.channel.onmessage = this.handleDataChannelMessage;
    },

    // This is called on an incoming message from our peer
    handleDataChannelMessage : function(event) {
      console.log('Recieved Message: ');
      console.log(event.data);
      p2p.pubsub.publish("p2p-message-received", { //Publish message once data is received
        data : event.data
      });
    },

    // This is called when the WebRTC sending data channel is offically 'open'
    handleDataChannelOpen : function() {
      console.log('Data channel created!');
      //this.dataChannel.send('Hello! I am ' + this.id);
    },

    // Called when the data channel has closed
    handleDataChannelClosed : function() {
      console.log('The data channel has been closed!');
    },

    // Function to offer to start a WebRTC connection with a peer
    connect : function() {
      var self = this;
      this.running = true;
      this.startSendingCandidates();
      this.peerConnection.createOffer(function(sessionDescription) {
        console.log('Sending offer to ' + self.remote);
        self.peerConnection.setLocalDescription(sessionDescription);
        self.sendSignalChannelMessage(sessionDescription.toJSON());
      });
    },

    // Function to initiate the WebRTC peerconnection and dataChannel
    initiateWebRTCState : function() {
      this.peerConnection = new RTCPeerConnection(this.servers);
      this.peerConnection.ondatachannel = this.handleDataChannel.bind(this);
      this.dataChannel = this.peerConnection.createDataChannel('myDataChannel');
      this.dataChannel.onmessage = this.handleDataChannelMessage;
      this.dataChannel.onopen = this.handleDataChannelOpen.bind(this);
    }
});

import Ember from "ember";
import config from '../../config/environment';
import _array from 'lodash/array';
import _collection from 'lodash/collection';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  users : inject.service("users"),
  webrtc : inject.service("webrtc"),
  notify : inject.service("notify"),
  webrtcInstance : null,
  isContactSelected : true,
  connectedUsers : [],
  selectedList : null,
  init : function () {
    const uid = this.get('session.secure.uid');
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    let self = this
    userRef.on("value", function(snapshot) {
      self.updateUsers();
    });
    this.updateUsers();
  },
  updateUsers : function () {
    const uid = this.get('session.secure.uid');
    let self = this;
    let usersRef = new Firebase(config.firebase + '/users/');
    this.get("users").getCurrentUser(uid).then(function (currentUser) {
      let friends = currentUser.friends || {};
      let connected = friends.connected || [];
      usersRef.orderByChild('online').startAt(true).on('value',  function (snap) { //Append online status & network ip
        let users = snap.val();
        _collection.each(connected, function (user) {
          if (users[user.uid].online === true) {
            user.isOnline = true;
          } else {
            user.isOnline = false;
          }
          user.online = users[user.uid].online;
          user.network = users[user.uid].network;
        });
        self.set("connectedUsers", connected);
      });

    });
  },
  actions : {
    toggleMenu(title) {
      let isContactSelected = (title === "contacts") ? true : false;
      this.set("isContactSelected", isContactSelected);
    },
    selectUser(user) {
      let webrtc = this.get("webrtc");
      let instance = webrtc.getInstance();
      let selectedList = $(event.target).closest("li");
      let notify = this.get("notify");

      //if same list item is clicked again then ignore
      if (selectedList.hasClass("active")) {
        return;
      }

      //Check if user is online then select the user
      if (!user.isOnline) {
        notify.info("User is offline. You can share file once user is online.");
        return;
      }

      //Switch Highlight of List
      if (this.get("selectedList")) {
        this.get("selectedList").removeClass("active");
        selectedList.addClass("active");
      } else {
        selectedList.addClass("active");
      }

      this.set("webrtcInstance", instance);
      webrtc.joinRoom(user.uid, instance);
      this.set("selectedList", selectedList);
    }
  }
});

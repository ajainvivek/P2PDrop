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
    this.get("users").getCurrentUser(uid).then(function (currentUser) {
      let friends = currentUser.friends || {};
      let connected = friends.connected || [];
      self.set("connectedUsers", connected);
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

      //if same list item is clicked again then ignore
      if (selectedList.hasClass("active")) {
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

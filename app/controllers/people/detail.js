import Ember from "ember";
import config from '../../config/environment';
import _array from 'lodash/array';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  user : {},
  uid : null,
  isPending : false,
  isConnected : false,
  isAvailable : false,
  connected : [],
  pending : [],
  traverseBack : function () {
    this.transitionToRoute("people.find");
  },
  checkStatus : function () {
    let userRef = new Firebase(config.firebase + '/users');
    let email = this.get("user").email;
    let self = this;

    // Attach an asynchronous callback to read the data at our posts reference
    userRef.orderByChild('email')
    .startAt(email)
    .endAt(email)
    .once("value", function(snapshot) {
        let snap = snapshot.val();
        let key = Object.keys(snap)[0];
        let user = snap[key];
        let friends = user.friends || {};
        let connected = friends.connected || [];
        let pending = friends.pending || [];

        //Set Connected & Pending List
        self.set("connected", connected);
        self.set("pending", pending);
        self.set("uid", key);

        if (_array.findIndex(connected, {email : email}) >= 0) {
          self.set("isConnected", true);
        } else if (_array.findIndex(pending, {email : email}) >= 0) {
          self.set("isPending", true);
        } else {
          self.set("isAvailable", true);
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  },
  actions : {
    sendConnectRequest() {
      let uid = this.get('uid');
      let self = this;
      let userRef = new Firebase(config.firebase + '/users/' + uid);
      let email = this.get("user").email;
      let name = this.get("user").name;
      let user = {
        email : email,
        name : name
      };
      let pending = this.get("pending");
      let connected = this.get("connected");
      pending.push(user);

      //on complete state change the state of btn
      let onComplete = function () {
        if (error) {
          console.log('Synchronization failed');
        } else {
          self.set("isAvailable", false);
          self.set("isPending", true);
        }
      }

      userRef.child('friends').set({ connected: connected, pending: pending }, onComplete);
    }
  }

});

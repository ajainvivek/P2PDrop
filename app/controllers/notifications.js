import Ember from "ember";
import config from '../config/environment';
import _array from 'lodash/array';
import _collection from 'lodash/collection';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  users : inject.service("users"),
  isPendingApprovals : false,
  pendingApprovals : [],
  getPendingApprovals : function () {
    const uid = this.get('session.secure.uid');
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    let self = this;

    return new Promise(function (resolve, reject) {
      userRef.on("value", function(snapshot) {
        let user = snapshot.val();
        let friends = user.friends || {};
        let pending = friends.pending || [];
        if (user.friends && user.friends.pending && user.friends.pending.length) {
          self.set("isPendingApprovals", true);
        } else {
          self.set("isPendingApprovals", false);
        }
        resolve(pending);
      });
    });
  },
  updateFriendRef : function (email, currentUser) {
    let userRef = new Firebase(config.firebase + '/users');
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
        let friendRef = new Firebase(config.firebase + '/users/' + key);

        connected.push(currentUser);

        //on complete state change the state of btn
        let onComplete = function (error) {
          if (error) {
            console.log('Synchronization failed');
          } else {
            console.log('Synchronization');
          }
        }

        friendRef.child('friends').set({ connected: connected, pending: pending }, onComplete);

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  },
  updateUserRef : function (state, user) {
    let self = this;
    const uid = this.get('session.secure.uid');
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    this.get("users").getCurrentUser(uid).then(function (currentUser) {
      let friends = currentUser.friends || {};
      let connected = friends.connected || [];
      let pending = friends.pending || [];

      if (state === "approve") {
        //Move to connected friends & remove from pending list
        connected.push(user);
        pending = _collection.reject(pending, {email : user.email});
      } else {
        pending = _collection.reject(pending, {email : user.email});
      }

      //on complete state change the state of btn
      let onComplete = function (error) {
        if (error) {
          console.log('Synchronization failed');
        } else {
          if (state === "approve") {
            self.updateFriendRef(user.email, {
              email : currentUser.email,
              name : currentUser.name,
              profilePic : {
                link : currentUser.profilePic.link
              },
              uid : uid
            });
          }
        }
      }

      userRef.child('friends').set({ connected: connected, pending: pending }, onComplete);

    });
  },
  actions : {
    approve(user) {
      this.updateUserRef("approve", user);
    },
    reject(user) {
      this.updateUserRef("reject", user);
    }
  }

});

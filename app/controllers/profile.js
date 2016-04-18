import Ember from 'ember';
import config from '../config/environment';
import _collection from 'lodash/collection';
const {
  Controller,
  inject
} = Ember;

export default Controller.extend( {
    notify: inject.service('notify'),
    users: inject.service('users'),
    currentUser : {},
    isMale: true,
    fetchUser : function () {
      const uid = this.get('session.secure.uid');
      let self = this;
      this.get("users").getCurrentUser(uid).then(function (currentUser) {
        self.set("currentUser", currentUser);
        self.set("profilePic", currentUser.profilePic);
      });
    }.on("init"),
    gender : function () {
      return this.get("isMale") ? "Male" : "Female";
    }.property("isMale"),
    profilePic: null,
    emailValidation: {
      'errorMessage': 'Please provide email in a valid format',
      'isError': (inputValue) => {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return !emailPattern.test(inputValue);
      }
    },
    actions: {
      update(){
        if (this.get('currentUser.name') === undefined && this.get('currentUser.name') === "") { return; }
        const uid = this.get('session.secure.uid');
        let self = this;
        let notify = this.get("notify");
        let name = this.get("name")
        let userRef = new Firebase(config.firebase + '/users/' + uid);
        let userConnRef = new Firebase(config.firebase + '/users/' + uid + '/friends/connected');
        //on complete state change the state of btn
        let onComplete = function (error) {
          if (error) {
            notify.alert(error.toString());
          } else {
            //TODO: Think about better solution to update friends
            userConnRef.once("value", function(snapshot) {
              let connected = snapshot.val();
              _collection.each(connected, function (user) {
                let connRef = new Firebase(config.firebase + '/users/' + user.uid + '/friends/connected');
                connRef.once("value", function(snapshot) {
                  let connected = snapshot.val();
                  _collection.each(connected, function (user, index) {
                    if (user.uid === uid) {
                      user.name = self.get('currentUser.name');
                      user.profilePic = self.get('profilePic');
                      user.gender = self.get('currentUser.gender');
                    }
                  });
                  let friendsConnRef = new Firebase(config.firebase + '/users/' + user.uid + '/friends');
                  friendsConnRef.update({
                    connected : connected
                  }, function () {
                    //console.log("updated");
                  });
                });
              });
            });
            notify.info("Profile Updated");
          }
        };

        userRef.update({
          name: this.get('currentUser.name'),
          profilePic : this.get("profilePic"),
          gender : this.get("currentUser.gender")
        }, onComplete);
      },
      setProfilePic(data){
        this.set("profilePic", data);
      }
    }
  }
);

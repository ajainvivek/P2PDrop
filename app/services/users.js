import Ember from "ember";
import _object from 'lodash/object';
import _collection from 'lodash/collection';
import config from '../config/environment';

const {
  Service,
  inject
} = Ember;

export default Service.extend({
  users : [],
  setUsers : function (users) {
    this.set("users", users);
  },
  getUsers : function () {
    return this.get("users");
  },
  getUser : function (email) {
    let users = this.get("users");
    let user = _collection.filter(users, {
      email : email
    })[0];
    return user;
  },
  getCurrentUser : function (uid) {
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    let self = this;

    return new Promise(function (resolve, reject) {
      userRef.once("value", function(snapshot) {
        let user = snapshot.val();
        resolve(user);
      });
    });
  },
  sendVerificationCode : function (uid, email) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        method: "POST",
        url: "https://p2pdrop-service.herokuapp.com/email",
        dataType: "json",
        data: { uid : uid, email: email },
        success: function (data) {
          resolve(data);
        },
        fail: function (error) {
          reject(error);
        }
      });
    });
  }
});

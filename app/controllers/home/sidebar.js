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
  isContactSelected : true,
  connectedUsers : [],
  init : function () {
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
    }
  }
});

import Ember from "ember";
import _object from 'lodash/object';
import _collection from 'lodash/collection';

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
  }
});

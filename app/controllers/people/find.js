import Ember from "ember";
import config from '../../config/environment';
import _object from 'lodash/object';
import _collection from 'lodash/collection';
import _array from 'lodash/array';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service('session'),
  users : inject.service('users'),
  filteredUsers : [],
  name : "",
  //Get Users
  fetchUsers : function () {
    let self = this;
    const uid = this.get('session.secure.uid');

    this.get("users").getCurrentUser(uid).then(function (user) {
      let email = user.email;
      new Firebase(config.firebase + "users").orderByChild('name')
      .on('value', function(snap){
          let usersList = snap.val();
          let users = _object.transform(usersList, function(memo, val, key) {
            if (val.name && val.email !== email) {
              memo.push(val);
            }
          }, []);
          self.get("users").setUsers(users);
          self.set("filteredUsers", _collection.sample(users, 10));
      });
    });
  }.on("init"),
  //Search Query
  searchQuery(query) {
    let users = this.get("users").getUsers();
    let chars = query.toLowerCase();
    let filteredName = _collection.filter(users, function (user) {
      let name = user.name.toLowerCase();
      if (name.search(chars) >= 0) {
        user.index = user.name.search(chars);
        return true;
      } else {
        return false;
      }
    });
    let filteredEmail = _collection.filter(users, function (user) {
      let name = user.email.toLowerCase();
      if (name.search(chars) >= 0) {
        user.index = user.name.search(chars);
        return true;
      } else {
        return false;
      }
    });
    let filtered = _array.union(filteredName, filteredEmail);
    let ordered = _collection.sortBy(filtered, ['index']);
    return ordered;
  },
  postKey: function(){
    let users = this.searchQuery(this.get('name'));
    this.set("filteredUsers", _array.take(users, 10));
  }.observes('name'),
  actions: {
    goToDetail(user) {
      this.transitionToRoute("people.detail", { queryParams: { email: user.email }});
    }
  }
});

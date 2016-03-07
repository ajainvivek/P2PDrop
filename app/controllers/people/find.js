import Ember from "ember";
import config from '../../config/environment';
import _object from 'lodash/object';
import _collection from 'lodash/collection';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service('session'),
  users : [],
  filteredUsers : [],
  name : "",
  //Get Users
  fetchUsers : function () {
    let self = this;
    new Firebase(config.firebase + "users").orderByChild('name')
    .once('value', function(snap){
        let usersList = snap.val();
        let users = _object.transform(usersList, function(memo, val, key) {
          if (val.name) {
            memo.push(val);
          }
        }, []);
        self.set("users", users);
        self.set("filteredUsers", users);
    });
  }.on("init"),
  //Search Query
  searchQuery(chars) {
    let users = this.get("users");
    let filtered = _collection.filter(users, function (user) {
      let name = user.name.toLowerCase();
      if (name.search(chars) >= 0) {
        user.index = user.name.search(chars);
        return true;
      } else {
        return false;
      }
    });
    let ordered = _collection.sortBy(filtered, ['index']);
    return ordered;
  },
  postKey: function(){
    let users = this.searchQuery(this.get('name'));
    this.set("filteredUsers", users);
  }.observes('name'),
  actions: {
    goToDetail(data) {
      this.transitionToRoute("people.detail");
    }
  }
});

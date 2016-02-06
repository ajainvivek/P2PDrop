import Ember from 'ember';
const {
  Controller,
  computed,
  inject
  } = Ember;

const {alias} = computed;

export default Controller.extend({
  application: inject.controller(),
  currentUser: alias('application.currentUser'),
  users:       alias('application.model'),

  onlineUsers: computed('model.@each.online', function(){
    let onlineUsers = this.get('model').filter( (user) => {
        return user.get('online') === 'true';
  });
    return onlineUsers.sortBy('name');
  }),

  offlineUsers: computed('model.@each.online', function(){
    let offlineUsers = this.get('model').filter( (user) => {
        return user.get('online') !== 'true';
  });
    return offlineUsers.sortBy('name');
  })
});

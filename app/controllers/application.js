import Ember from 'ember';
import config from '../config/environment';
const {
  Controller,
  computed
  } = Ember;

export default Controller.extend({
  currentUser: computed('session.secure.uid', function(){
    const uid = this.get('session.secure.uid');
    if (uid !== undefined) {
      this.setUpPresenceCheck(uid);
      return this.store.find('user', uid);
    } else {
      return null;
    }
  }),

  setUpPresenceCheck(uid){
    const isConnected = new Firebase(config.firebase + '/.info/connected');
    isConnected.on('value', function(snapshot){
      if (snapshot.val()){
        let userRef = new Firebase(config.firebase + '/users/' + uid + '/online');
        userRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
        userRef.set(true);
      }
    });
  }
});

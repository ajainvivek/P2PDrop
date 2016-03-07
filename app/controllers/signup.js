import Ember from 'ember';
import config from '../config/environment';
import LoginUser from '../mixins/signin-user';
import _collection from 'lodash/collection';
const {
  Controller,
  inject
} = Ember;

export default Controller.extend(
  LoginUser, {
    randomProfilePics : {
      male : [{
        link : 'https://i.imgur.com/70XDfct.png'
      }, {
        link : 'https://i.imgur.com/DajTmy0.png'
      }, {
        link : 'https://i.imgur.com/8lHCaq0.png'
      }, {
        link : 'https://i.imgur.com/FRZNJT4.png'
      }, {
        link : 'https://i.imgur.com/N7XfhNS.png'
      }, {
        link : 'https://i.imgur.com/O2g5Iq5.png'
      }, {
        link : 'https://i.imgur.com/yJPeOxk.png'
      }, {
        link : 'https://i.imgur.com/YbW6RQz.png'
      }, {
        link : 'https://i.imgur.com/ywtUQqV.png'
      }],
      female : [{
        link : 'https://i.imgur.com/8i78xQg.png'
      }, {
        link : 'https://i.imgur.com/GkR1Bom.png'
      }, {
        link : 'https://i.imgur.com/GirKSFj.png'
      }, {
        link : 'https://i.imgur.com/RJNil6u.png'
      }, {
        link : 'https://i.imgur.com/5jAAP8d.png'
      }, {
        link : 'https://i.imgur.com/YtBMJKH.png'
      }, {
        link : 'https://i.imgur.com/DAgl4rz.png'
      }]
    },
    isMale: true,
    uploadedImage: null,
    gender : function () {
      return this.get("isMale") ? "Male" : "Female";
    }.property("isMale"),
    profilePic: function () {
      let uploadedImage = this.get("uploadedImage");
      if (uploadedImage) {
        return uploadedImage;
      } else {
        let randomPics = this.get("isMale") ? this.get("randomProfilePics").male : this.get("randomProfilePics").female;
        return _collection.sample(randomPics);
      }
    }.property("isMale"),
    emailValidation: {
      'errorMessage': 'Please provide email in a valid format',
      'isError': (inputValue) => {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return !emailPattern.test(inputValue);
      }
    },
    userValues(){
      return {
        email: this.get('email'),
        password: this.get('password'),
        passwordConfirmation: this.get('passwordConfirmation')
      };
    },
    actions: {
      signup(){
        if (this.get('name') === undefined) { return; }
        const firebase = new Firebase(config.firebase);
        firebase.createUser(this.userValues(), (error, userData) => {
            if (error) {
              //Handle Errors here.
            } else {
              this.store.createRecord('user', {
              id: userData.uid,
              name: this.get('name'),
              profilePic : this.get("profilePic"),
              sex : this.get("gender")
            }).save();
            this.authenticateUser(this.get('email'), this.get('password'));
          }
        });
      },
      setProfilePic(data){
        this.set("profilePic", data);
        this.set("uploadedImage", data);
      },
      goToLogin() {
        this.transitionToRoute("signin");
      }
    }
  }
);

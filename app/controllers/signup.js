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
    notify: inject.service('notify'),
    spinner: inject.service('spinner'),
    users: inject.service('users'),
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
        let self = this;
        this.get('spinner').show('app-spinner');
        firebase.createUser(this.userValues(), (error, userData) => {
            if (error) {
              this.get('spinner').hide('app-spinner');
              this.get('notify').alert(error.toString());
            } else {
              this.store.createRecord('user', {
                id: userData.uid,
                name: this.get('name'),
                profilePic : this.get("profilePic"),
                gender : this.get("gender"),
                email : this.get("email"),
                friends : {
                  connected : [],
                  pending : []
                },
                networks : {},
                isVerified : false
              }).save();
              this.authenticateUser(this.get('email'), this.get('password'), function (callback) {
                self.get("users").sendVerificationCode(userData.uid, self.get('email')).then(function (data) {
                  if (data.status === "success") {
                    self.get('notify').info("Verification mail sent!");
                    callback(data.guid);
                  } else {
                    self.get('notify').info("Verification mail not sent!");
                    self.get('spinner').hide('app-spinner');
                  }
                }, function () {
                  self.get('notify').info("Verification mail not sent!");
                  self.get('spinner').hide('app-spinner');
                })
              });
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

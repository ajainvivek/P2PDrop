import Ember from 'ember';
const {
  Component,
  inject
} = Ember;

export default Component.extend({
  imgur: inject.service(),
  file: inject.service(),
  profilePic : {
    link : 'https://i.imgur.com/DAgl4rz.png'
  },
  didInsertElement: function () {
    $("body").on("click", "#imgSelector", function (evt) {
      evt.stopPropagation();
    });
  },
  actions: {
    //Trigger File Select
    triggerFileSelect(){
      $("#imgSelector").trigger("click");
    },
    //Upload Image
    uploadImage(){
      event.stopPropagation();
      let self = this;
      this.get("file").read(event).then(function (imageData) {
        self.get('imgur').imagePost(imageData[0].result.split(',')[1]).then((result) => {
          self.sendAction("imageUploaded", result.data);
        }).catch((result) => {
          console.error(result);
        });
      });
    }
  }
});

import Ember from "ember";
const {
  Component,
  inject
} = Ember;

export default Component.extend({
  file: inject.service(),
  didInsertElement: function () {
    $("#p2p-files").on("click", function (evt) {
      evt.stopPropagation();
    });
  },
  actions : {
    //Trigger File Select
    triggerFileSelect: function () {
      this.sendAction("triggerFileSelect", function () {
        $("#p2p-files").trigger("click");
      });
    },
    //Handle File Select Event
    onFileSelect : function () {
      event.stopPropagation();
      let self = this;
      this.get("file").read(event).then(function (data) {
        self.sendAction("onFileSelect", data);
      });
    },
    //On Drag Over
    onDragOver : function () {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      $(".dropzone-content").css({
        border: "2px dashed #04A9EB"
      });
    },
    //On Drag Leave
    onDragLeave : function () {
      $(".dropzone-content").css({
        border: "2px dashed #CCC"
      });
    },
    //On Drop Of File
    onDrop  : function () {
      event.preventDefault();
      let self = this;

      $(".dropzone-content").css({
        border: "2px dashed #CCC"
      });

      this.get("file").read(event).then(function (data) {
        self.sendAction("onFileSelect", data);
      });
    }
  }
});

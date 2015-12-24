import Ember from "ember";
var inject = Ember.inject;

export default Ember.Component.extend({
  file: inject.service(),
  swebrtc : inject.service(),
  didInsertElement: function () {
    var self = this;
    var dropZone = $("#p2p-file-drop-zone");

    //Handle File Select Event
    $("#p2p-files").on("change", function (evt) {
      self.get("file").read(evt).then(function (data) {
        self.get("swebrtc").sendFile(data[0].file);
      });
    });

    //Bind File Select Event
    $("#p2p-files").on("click", function (evt) {
      evt.stopPropagation();
    });

    //Bind Drag & Drop Event
    dropZone.on('dragover', function (evt) {
      self.handleDragOver(evt);
      $(".dropzone-content").css({
        border: "2px dashed #04A9EB"
      });
    });
    dropZone.on('dragleave', function (evt) {
      $(".dropzone-content").css({
        border: "2px dashed #CCC"
      });
    });
    dropZone.on('drop', function (evt) {
      $(".dropzone-content").css({
        border: "2px dashed #CCC"
      });
    });
  },
  handleDragOver: function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },
  actions : {
    triggerFileSelect: function () {
      $("#p2p-files").trigger("click");
    }
  }
});

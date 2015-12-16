import Ember from 'ember';

export default Ember.Service.extend({
  handleFileSelect : function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files || evt.dataTransfer.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push({
        name :  escape(f.name),
        type : f.type || 'n/a',
        size : f.size,
        lastModifiedDate : f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
      });
    }
    return output;
  }
});

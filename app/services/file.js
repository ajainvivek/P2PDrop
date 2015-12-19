import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Service.extend({
  getFiles : function (evt) {
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
        lastModifiedDate : f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        file: f
      });
    }
    return output;
  },

  read : function (evt) {
    var reader = new FileReader();
    var files = this.getFiles(evt);

    return new Ember.RSVP.Promise(function (resolve, reject) {
      _.each(files, function (item, index) {
        // Closure to capture the file information.
        reader.onload = (function(file) {
          return function(e) {
            item.result = e.target.result;
            if (index === files.length - 1) {
              resolve(files);
            }
          };
        })(item.file);

        // Read in the image file as a data URL.
        reader.readAsDataURL(item.file);
      });
    });
  }
});

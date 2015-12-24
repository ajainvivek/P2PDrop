import Ember from 'ember';
import _ from 'lodash';

export default Ember.Helper.helper(function(params, hash) {
  let fileName = params[0];
  let extension = fileName.replace(/^.*\./, '');
  let extensionMap = [{
      key: "photo",
      value: ["jpeg", "jpg", "png", "gif"]
    }, {
      key: "pdf",
      value: ["pdf"]
    }, {
      key: "txt",
      value: ["txt"]
    }, {
      key: "doc",
      value: ["doc", "docx"]
    }, {
      key: "photoshop",
      value: ["psd"]
    }, {
      key: "movie",
      value: ["mpeg4", "mpeg", "mp4", "avi"]
    }, {
      key: "ppt",
      value: ["ppt"]
    }, {
      key: "music",
      value: ["mp3", "ogg"]
    }, {
      key: "compressed",
      value: ["zip", "rar", "7z"]
    }];
    
  let type = _.filter(extensionMap, _.matches({ value: [extension]}));
  let typeName;

  if (type.length) {//if exists
    typeName = type[0].key;
  } else {
    typeName = 'unknown';
  }

  return typeName;
});

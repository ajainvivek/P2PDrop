import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  showModalDialog : false,
  title : "",
  leftBtnText : "",
  rightBtnText : "",
  callback : function () {},
  self : {},
  setSelf : function () {
    let self = this;
    let context = this.get("self");
    if (!Ember.isEmpty(context)) { //To ensure the DOM doesnt get rendered
      this.set("self", {
        open : self.open.bind(self),
        close : self.close.bind(self),
        toggle : self.toggle.bind(self)
      });
    }
  }.on("didInsertElement"),
  open : function (callback) {
    this.set("showModalDialog", true);
    if (typeof callback === "function") {
      this.set("callback", callback);
    }
  },
  close : function () {
    this.set("showModalDialog", false);
  },
  toggle : function () {
    let showModalDialog = this.get("showModalDialog");
    this.set("showModalDialog", !showModalDialog);
  },
  actions: {
    open() {
      this.open();
    },
    close() {
      this.close();
    },
    callback() {
      this.callback();
      this.close();
    }
  }
});

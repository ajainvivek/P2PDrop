import Ember from "ember";

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  isContactSelected: true,
  actions: {
    toggleMenu(title) {
      let isContactSelected = (title === "contacts") ? true : false;
      this.set("isContactSelected", isContactSelected);
    }
  }
});

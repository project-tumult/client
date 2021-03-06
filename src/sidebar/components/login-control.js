'use strict';

var persona = require('../filter/persona');

module.exports = {
  controllerAs: 'vm',
  //@ngInject
  controller: function (serviceUrl, settings) {
    this.serviceUrl = serviceUrl;
    this.isThirdPartyUser = function() {
      return persona.isThirdPartyUser(this.auth.userid, settings.authDomain);
    };
  },
  bindings: {
    /**
     * An object representing the current authentication status.
     */
    auth: '<',
    /**
     * Called when the user clicks on the "About this version" text.
     */
    onShowHelpPanel: '&',
    /**
     * Called when the user clicks on the "Log in" text.
     */
    onLogin: '&',
    /**
     * Called when the user clicks on the "Sign Up" text.
     */
    onSignUp: '&',
    /**
     * Called when the user clicks on the "Log out" text.
     */
    onLogout: '&',
    /**
     * Whether or not to use the new design for the control.
     *
     * FIXME: should be removed when the old design is deprecated.
     */
    newStyle: '<',
  },
  template: require('../templates/login-control.html'),
};

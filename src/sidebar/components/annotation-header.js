'use strict';

var annotationMetadata = require('../annotation-metadata');
var memoize = require('../util/memoize');
var persona = require('../filter/persona');

// @ngInject
function AnnotationHeaderController($rootScope, groups, settings, serviceUrl) {
  var self = this;

  this.user = function () {
    return self.annotation.user;
  };

  this.username = function () {
    return persona.username(self.annotation.user);
  };

  this.isThirdPartyUser = function () {
    return persona.isThirdPartyUser(self.annotation.user, settings.authDomain);
  };

  this.serviceUrl = serviceUrl;

  this.group = function () {
    return groups.get(self.annotation.group);
  };

  var documentMeta = memoize(annotationMetadata.domainAndTitle);
  this.documentMeta = function () {
    return documentMeta(self.annotation);
  };

  this.updated = function () {
    return self.annotation.updated;
  };

  this.htmlLink = function () {
    if (self.annotation.links && self.annotation.links.html) {
      return self.annotation.links.html;
    }
    return '';
  };

  $rootScope.$on('playerStateChanged', function(event, value) {
    console.log("Now the playerState is available in the annotation-header " + value);
  });

  //adding video related methods
  this.videoUrl = function() {
    if(self.annotation.hasOwnProperty('viddata')) {

      //Youtube code
      var videoData = self.annotation.viddata;
      var vidUrl = videoData[0].uri;
      var id = vidUrl.split('v=')[1]
      id = id.split('&')[0];

      var starttime = Math.round(videoData[0].starttime).toString();
      var endtime = Math.round(videoData[0].endtime).toString();

      var embedUrl = "https://www.youtube.com/embed/"+id+"?start="+starttime+"&end="+endtime;

      return embedUrl;
    }
    else {
      return false;
    }
  };

  //Setting iframe id same as annotation id
  this.getPlayerId = function() {

    return self.annotation.id;
  };


}

/**
 * Header component for an annotation card.
 *
 * Header which displays the username, last update timestamp and other key
 * metadata about an annotation.
 */
module.exports = {
  controller: AnnotationHeaderController,
  controllerAs: 'vm',
  bindings: {
    /**
     * The saved annotation
     */
    annotation: '<',

    /**
     * True if the annotation is private or will become private when the user
     * saves their changes.
     */
    isPrivate: '<',

    /** True if the user is currently editing the annotation. */
    isEditing: '<',

    /**
     * True if the annotation is a highlight.
     * FIXME: This should determined in AnnotationHeaderController
     */
    isHighlight: '<',
    onReplyCountClick: '&',
    replyCount: '<',

    /** True if document metadata should be shown. */
    showDocumentInfo: '<',
  },
  template: require('../templates/annotation-header.html'),
};

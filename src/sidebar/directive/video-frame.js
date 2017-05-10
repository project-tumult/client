

function extractIdFromUrl(vidUrl) {

  var id;

  if(vidUrl.includes("youtube.com")) {
    id = vidUrl.split('v=')[1]
    id = id.split('&')[0];
    return id;        
  }
  else if(vidUrl.includes("vimeo.com")) {
    id = vidUrl.split('.com/')[1]
    return id;
  }
  else if(vidUrl.includes("dailymotion.com")) {
    id = vidUrl.split('/video/')[1];
    id = id.split('_')[0];
    return id;
  }
  return "fake_id";

};


//FIXME: Solve for VIMEO API availability at the time of calling the player

//module.exports = ['vimeoService', 'dmService', function (vimeoService, dmService) {
  module.exports = function() {
  return {
    restrict: 'E',

    // compile: function(tElem, tAttr) {

    //   var e = document.createElement('script');
    //   e.async = true;
    //   e.src = "https://api.dmcdn.net/all.js";

    //   var s = document.getElementsByTagName('script')[0];
    //   s.parentNode.insertBefore(e, s);    


    //   var tag = document.createElement('script');
    //   tag.async = true;
    //   tag.src = "https://player.vimeo.com/api/player.js";
    //   var firstScriptTag = document.getElementsByTagName('script')[0];
    //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 

    //   return {
    //     pre: function preLink(scope, elem, attr ) {  },
    //     post: function postLink(scope, elem, attr) {  
    //       console.log("Inside Link");

    //       var playerId = scope.vm.getPlayerId();
    //       var annotation = scope.vm.annotation;
        
    //       var videoData = annotation.viddata;
    //       var vidUrl = videoData[0].uri;

    //       var startTime = Math.round(videoData[0].starttime).toString();
    //       var endTime = Math.round(videoData[0].endtime).toString();      

    //       var sourceId = extractIdFromUrl(vidUrl);


    //       //VIMEO CODE
    //       if(vidUrl.includes("vimeo.com")) {

    //         var options = {
    //           id: sourceId,
    //           width: 360  //Fix this for all platforms
    //         };

    //         var vmPlayer = new Vimeo.Player(elem[0], options);

    //         var onPlay = function() {
    //           vmPlayer.setCurrentTime(startTime).then(function(seconds) {})          
    //         };

    //         vmPlayer.on('play', onPlay);

    //         var doPause = true;

    //         var onPlaying = function(e) {

    //           vmPlayer.getCurrentTime().then(function(startPoint) {

    //             if(startPoint < endTime)
    //               doPause = true;

    //             //Get the current time of the playback
    //             if( doPause && startPoint >= endTime)
    //             {
    //               vmPlayer.pause();
    //               doPause = false;
    //               vmPlayer.off('play');
    //             }

    //           });
    //         };

    //         vmPlayer.on('timeupdate', onPlaying);

    //       }
    //       //DAILYMOTION CODE
    //       else if(vidUrl.includes("dailymotion.com")) {

    //         //My developer API key
    //         DM.init({ apiKey: '7bfd31f1d9129b3a9be0', status: true, cookie: true });

    //         console.log("Reached here after DM");
    //         var player = DM.player(elem[0], {
    //           video: sourceId,
    //           params: {
    //             autoplay: false,
    //             start: startTime //Time where the video should start
    //           }
    //         });

    //         var doPause = true;

    //         var handleTimeUpdate = function(e) {

    //           var startPoint = player.currentTime;

    //           if(startPoint < endTime)
    //             doPause = true;


    //           //Get the current time of the playback
    //           if( doPause && startPoint >= endTime)
    //           {
    //             player.pause();
    //             doPause = false;
    //           }
    //         };

    //         player.addEventListener('timeupdate', handleTimeUpdate);
    //       }
    //       //YOUTUBE CODE
    //       else if(vidUrl.includes("youtube.com")) {

    //       }


    //     }

    //   };

    // },

    link: function (scope, elem, attr) {

      var playerId = scope.vm.getPlayerId();
      var annotation = scope.vm.annotation;
    
      var videoData = annotation.viddata;
      var vidUrl = videoData[0].uri;

      var startTime = Math.round(videoData[0].starttime).toString();
      var endTime = Math.round(videoData[0].endtime).toString();      

      var sourceId = extractIdFromUrl(vidUrl);


      //VIMEO CODE
      if(vidUrl.includes("vimeo.com")) {

        var options = {
          id: sourceId,
          width: 360  //Fix this for all platforms
        };

        var vmPlayer = new Vimeo.Player(elem[0], options);

        var onPlay = function() {
          vmPlayer.setCurrentTime(startTime).then(function(seconds) {})          
        };

        vmPlayer.on('play', onPlay);

        var doPause = true;

        var onPlaying = function(e) {

          vmPlayer.getCurrentTime().then(function(startPoint) {

            if(startPoint < endTime)
              doPause = true;

            //Get the current time of the playback
            if( doPause && startPoint >= endTime)
            {
              vmPlayer.pause();
              doPause = false;
              vmPlayer.off('play');
            }

          });
        };

        vmPlayer.on('timeupdate', onPlaying);

      }
      //DAILYMOTION CODE
      else if(vidUrl.includes("dailymotion.com")) {

        //My developer API key
        DM.init({ apiKey: '7bfd31f1d9129b3a9be0', status: true, cookie: true });

        var player = DM.player(elem[0], {
          video: sourceId,
          params: {
            autoplay: false,
            start: startTime //Time where the video should start
          }
        });

        var doPause = true;

        var handleTimeUpdate = function(e) {

          var startPoint = player.currentTime;

          if(startPoint < endTime)
            doPause = true;


          //Get the current time of the playback
          if( doPause && startPoint >= endTime)
          {
            player.pause();
            doPause = false;
          }
        };

        player.addEventListener('timeupdate', handleTimeUpdate);
      }
      //YOUTUBE CODE
      else if(vidUrl.includes("youtube.com")) {
        //Using the iframe solution on Youtube as the YT API was causing annoying issues
        var iframe = document.createElement('iframe');
        iframe.src = "https://www.youtube.com/embed/"+sourceId+"?start="+startTime+"&end="+endTime;

        elem[0].replaceWith(iframe);
      }

//       else {
        
//         FB.init({
//           appId      : '1867898310150686',
//           xfbml      : true,
//           version    : 'v2.9'
//         });

//         var fbDiv = document.createElement('div');
//         fbDiv.setAttribute("class", "fb-video");
//         fbDiv.setAttribute("data-href", "https://www.facebook.com/facebook/videos/10153231379946729/");
//         fbDiv.setAttribute("data-width", "200");
//         fbDiv.setAttribute("data-allowfullscreen", "true");
//         elem[0].replaceWith(fbDiv);

//       }

    },
    template: require('../templates/video-frame.html'),
  };
}

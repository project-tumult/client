Annotator = require('annotator')
$ = Annotator.$

makeButton = (item) ->
  anchor = $('<button></button>')
  .attr('href', '')
  .attr('title', item.title)
  .attr('name', item.name)
  .on(item.on)
  .addClass('annotator-frame-button')
  .addClass(item.class)
  button = $('<li></li>').append(anchor)
  return button[0]

module.exports = class Toolbar extends Annotator.Plugin
  HIDE_CLASS = 'annotator-hide'
  IDLIST = []

  events:
    'setVisibleHighlights': 'onSetVisibleHighlights'

  html: '<div class="annotator-toolbar"></div>'

  pluginInit: ->
    @annotator.toolbar = @toolbar = $(@html)
    if @options.container?
      $(@options.container).append @toolbar
    else
      $(@element).append @toolbar

    items = [
      "title": "Toggle or Resize Sidebar"
      "class": "annotator-frame-button--sidebar_toggle h-icon-chevron-left"
      "name": "sidebar-toggle"
      "on":
        "click": (event) =>
          event.preventDefault()
          event.stopPropagation()
          collapsed = @annotator.frame.hasClass('annotator-collapsed')
          if collapsed
            @annotator.show()
          else
            @annotator.hide()
    ,
      "title": "Hide Highlights"
      "class": "h-icon-visibility"
      "name": "highlight-visibility"
      "on":
        "click": (event) =>
          event.preventDefault()
          event.stopPropagation()
          state = not @annotator.visibleHighlights
          @annotator.setVisibleHighlights state
    ,
      "title": "Youtube Recording"
      "class": "h-icon-note"
      "name": "insert-video"
      "on":
        "click": (event) =>
          event.preventDefault()
          event.stopPropagation()
          uri = document.location.href
          val = {}

          #On youtube
          onYT = uri.includes("youtube.com")

          if onYT
            ytPlayer = document.getElementById("movie_player")

            if IDLIST.length > 0
              endTime = ytPlayer.getCurrentTime()
              IDLIST[0].endtime = endTime

              @annotator.createAnnotation(viddata: IDLIST)
              IDLIST = []

            else
              startTime = ytPlayer.getCurrentTime()

              #set endtime to video duration by default
              endTime = ytPlayer.getDuration()

              #Refer to paramlist code later

              val.starttime = startTime
              val.endtime = endTime
              val.uri = uri
              IDLIST.push(val)

              @annotator.createAnnotation(viddata: IDLIST)
              IDLIST = []
          else
            alert("Works on youtube only")

          @annotator.show()          
#    ,
#      "title": "New Page Note"
#      "class": "h-icon-note"
#      "name": "insert-comment"
#      "on":
#        "click": (event) =>
#          event.preventDefault()
#          event.stopPropagation()
#          @annotator.createAnnotation()
#          @annotator.show()
    ]
    @buttons = $(makeButton(item) for item in items)

    list = $('<ul></ul>')
    @buttons.appendTo(list)
    @toolbar.append(list)

    # Remove focus from the anchors when clicked, this removes the focus
    # styles intended only for keyboard navigation. IE/FF apply the focus
    # psuedo-class to a clicked element.
    @toolbar.on('mouseup', 'a', (event) -> $(event.target).blur())

  onSetVisibleHighlights: (state) ->
    if state
      $('[name=highlight-visibility]')
      .removeClass('h-icon-visibility-off')
      .addClass('h-icon-visibility')
      .prop('title', 'Hide Highlights');
    else
      $('[name=highlight-visibility]')
      .removeClass('h-icon-visibility')
      .addClass('h-icon-visibility-off')
      .prop('title', 'Show Highlights');

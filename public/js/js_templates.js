var templates = (function () {
  return {
    'compilationinfo': function (data) {
      var result = $('<table/>', {class: 'table'});
      data.songs.forEach(function (song, num) {
        var tr = $('<tr/>', {
          'data-spa': 'player',
          'href': song.path,
          'data-title': song.title,
          'data-artist': song.artist,
          'data-album': song.album
        })
          .append($('<td/>').append($('<span/>', {class: 'fa fa-play', 'data-add': 'play'})))
          .append($('<td/>').html(song.title))
          .append($('<td/>').html(song.artist))
          .append($('<td/>').html(song.album))
          .append($('<td/>').append($('<span/>', {class: 'fa fa-plus', 'data-add': 'plus'})));
        result.append(tr)
      });

      return result;
    }
  };
})();
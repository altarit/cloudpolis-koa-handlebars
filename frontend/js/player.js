var info = require('js/info');
var templates = require('js/hb-templates');

var player = document.getElementById('pl-audio');
var progressBar = document.getElementsByClassName('pl-musicbar')[0];
var loadBar = document.getElementsByClassName('pl-musicloadbar')[0];
var progressInfo = document.getElementsByClassName('pl-musictime')[0];
var durationInfo = document.getElementsByClassName('pl-musiclength')[0];
var trackInfo = document.getElementsByClassName('pl-musicinfo')[0];
var sideMenu = document.getElementsByClassName('pl-menu')[0];
var currentSong;
var currentSonglist;
var currentSonglistAndNotPlaylist;


var playerOptions = {
  repeat: false,
  random: false,
  volumeoff: false
};


var actions = {
  'prev': function (e) {
    playMusic(null, null, 'prev');
  },
  'next': function (e) {
    playMusic(null, null, 'next');
  },
  'play': function (e) {
    startPlaying(player.paused);
  },
  'repeat': function (e) {
    playerOptions.repeat = !playerOptions.repeat;
    e.target.classList.toggle('active', playerOptions.repeat);
  },
  'random': function (e) {
    playerOptions.random = !playerOptions.random;
    e.target.classList.toggle('active', playerOptions.random);
  },
  'volumeoff': function (e) {
    playerOptions.volumeoff = !playerOptions.volumeoff;
    e.target.classList.toggle('active', playerOptions.volumeoff);
    e.target.classList.toggle('fa-volume-off', playerOptions.volumeoff);
    e.target.classList.toggle('fa-volume-up', !playerOptions.volumeoff);
    player.muted = playerOptions.volumeoff;
  },
  playlist: function (e) {
    $(sideMenu).stop(true, true).toggle("slide", {direction: "right"}, 200);
  },
  'current': function (e) {
    if (!currentSong)
      return info.error.show('Ничего не вопроизводится');
    if (!currentSong.parentNode)
      return info.error.show('Нет ссылки на список');
    if (!currentSong.parentNode.children)
      return info.error.show('Список пуст');
    var templateFunction = templates['copy_songlist'];
    var pl = document.getElementById('pl-tab-stored');
    $(pl).html(templateFunction(currentSong.parentNode));
  },
  'clean': function (e) {
    document.getElementById('pl-stored').innerHTML = '';
  },
  'changetab': function (e) {
    $('#pl-tab-content > div').hide();
    $('#pl-extra-menu > div').hide();
    $(document.getElementById('pl-tab-' + e.target.getAttribute('aria-controls'))).show();
    $(document.getElementById('pl-tabmenu-' + e.target.getAttribute('aria-controls'))).show();
  }
};

function startPlaying (play) {
  if (play === undefined)
    play = true;
  var pausebutton = $('.button-pause')[0];
  if (play) {
    player.play();
    player.setAttribute('autoplay', '');
  } else {
    player.pause();
    player.removeAttribute('autoplay');
  }
  pausebutton.classList.toggle('fa-play', !play);
  pausebutton.classList.toggle('fa-pause', play);
}

$('.pl-buttons').click(handlePlayMenu);
sideMenu.addEventListener('click', handlePlayMenu);

function handlePlayMenu(e) {
  e.preventDefault();
  if (e.target.tagName == 'A') {
    var name = e.target.getAttribute('data-action')
    if (actions[name])
      actions[name](e);
    else
      console.log('Action "' + name + '" not found');
  }
}


document.getElementById('volume').addEventListener('change', function (e) {
  player.volume = e.target.value / 20;
});

progressBar.parentNode.addEventListener('click', function (e) {
  if (window.getSelection().toString())
    return;
  player.currentTime = (e.pageX - this.offsetLeft) / this.clientWidth * player.duration;
  e.preventDefault();
});

player.addEventListener('timeupdate', function () {
  var progress = player.currentTime / player.duration;
  progressBar.style.width = progress * 100 + '%';
  progressInfo.innerHTML = toMMSS(player.currentTime);

  if (progress == 1) {
    if (playerOptions.repeat) {
      player.currentTime = 0;
      progressBar.style.width = '0%';
      startPlaying();
      return;
    }
    playMusic(null, null, 'next');
  }
});

player.addEventListener('error', function(e) {
  //info.error.show('File cannot be loaded');
});

player.addEventListener('durationchange', function(e) {
  durationInfo.innerHTML = toMMSS(player.duration); //delete when actual duration info has been getted
});


function toMMSS(sec_num) {
  var minutes = Math.floor(sec_num / 60);
  var seconds = Math.floor(sec_num - minutes * 60);
  if (seconds < 10) seconds = '0' + seconds;
  return minutes+':'+seconds;
}




player.addEventListener('progress', function () {
  var len = player.buffered.length;

  if (player.buffered.length) {
    var start = player.buffered.start(len - 1) / player.duration;
    var end = player.buffered.end(len - 1) / player.duration;
    //hhloadBar.style.left = start * 100 + '%';
    loadBar.style.width = end * 100 + '%';
  } else {
    loadBar.style.left = 0;
    loadBar.style.width = 0;
  }
});

function selectTarget(target, order) {
  if (order == 'next') {
    if (playerOptions.random) {
      if (target.parentNode) {
        var children = target.parentNode.children;
        return children[Math.floor(Math.random() * children.length) % children.length];
      } else
        return info.error.show('Не удается загрузить исходный список');
    } else {
      if (target.nextElementSibling)
        return target.nextElementSibling;
      else
        return info.error.show('Последний файл в списке');
    }
  } else if (order == 'prev') {
    if (target.previousElementSibling)
      return target.previousElementSibling;
    else
      return info.error.show('Первый файл в списке');
  }
}

function setTimeToZero() {
  player.currentTime = 0;
  progressInfo.innerHTML = '0:00';
  progressBar.style.width = '0%';
  loadBar.style.left = 0;
}

function loadSong(target) {
  $('li.playing').removeClass('playing');
  $(target).addClass('playing');
  if (target.parentNode == currentSonglistAndNotPlaylist)
    $('li[data-href="' + target.dataset.href + '"]', '#pl-tab-current').addClass('playing');

  if(player.getAttribute('src') === target.dataset.href)
    return;
  console.debug('loadSong ' + target.dataset.href);
  currentSong = target;
  player.setAttribute('src', target.dataset.href);
  trackInfo.innerHTML = '<b>' + target.dataset.title + '</b><br>' + target.dataset.artist + ' - ' + target.dataset.album;
  durationInfo.innerHTML = target.dataset.duration || '';
  loadBar.style.width = 0;
}

function setCurrentPlaylist(target) {
  if (!target.parentNode || target.parentNode == currentSonglistAndNotPlaylist)
    return;
  currentSonglist = target.parentNode;
  if ($(target).closest('.pl-playlist').length)
    return;
  currentSonglistAndNotPlaylist = target.parentNode;
  console.debug('setCurrentPlaylist ');
  var templateFunction = templates['copy_songlist'];
  var pl = document.getElementById('pl-tab-current');
  $(pl).html(templateFunction(currentSonglist));
  return $('li[data-href="' + target.dataset.href + '"]', pl)[0];
}


function playMusic(target, add, order) {
  if (!target)
    target = currentSong;
  if (target == null)
    return;

  if (order) {
    target = selectTarget(target, order);
    if (!target)
      return startPlaying(false);
  }

  if (add == 'plus') {
    console.log('plus');
  } else {
    if (!currentSong || target) {
      currentSong = setCurrentPlaylist(target) || currentSong;
      loadSong(target);
    }
    setTimeToZero();
    startPlaying();
  }
}

function hanldeSpaClick(target, options) {
  playMusic(target, options);
}

module.exports.hanldeSpaClick = hanldeSpaClick;
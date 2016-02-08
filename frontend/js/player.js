var info = require('js/info');
var templates = require('js/hb-templates');

var mp3player = document.getElementById('pl-audio');
var mp3bar = document.getElementsByClassName('pl-musicbar')[0];
var mp3load = document.getElementsByClassName('pl-musicloadbar')[0];
var mp3time = document.getElementsByClassName('pl-musictime')[0];
var mp3length = document.getElementsByClassName('pl-musiclength')[0];
var mp3info = document.getElementsByClassName('pl-musicinfo')[0];
var sidemenu = document.getElementsByClassName('pl-menu')[0];
var currentSong;
var currentPlaylist;


var mp3options = {
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
    startPlaying(mp3player.paused);
  },
  'repeat': function (e) {
    mp3options.repeat = !mp3options.repeat;
    e.target.classList.toggle('active', mp3options.repeat);
  },
  'random': function (e) {
    mp3options.random = !mp3options.random;
    e.target.classList.toggle('active', mp3options.random);
  },
  'volumeoff': function (e) {
    mp3options.volumeoff = !mp3options.volumeoff;
    e.target.classList.toggle('active', mp3options.volumeoff);
    e.target.classList.toggle('fa-volume-off', mp3options.volumeoff);
    e.target.classList.toggle('fa-volume-up', !mp3options.volumeoff);
    mp3player.muted = mp3options.volumeoff;
  },
  playlist: function (e) {
    $(sidemenu).stop(true, true).toggle("slide", {direction: "right"}, 200);
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
    console.log(e.target.getAttribute('aria-controls'));
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
    mp3player.play();
    mp3player.setAttribute('autoplay', '');
  } else {
    mp3player.pause();
    mp3player.removeAttribute('autoplay');
  }
  pausebutton.classList.toggle('fa-play', !play);
  pausebutton.classList.toggle('fa-pause', play);
}

$('.pl-buttons').click(handlePlayMenu);
sidemenu.addEventListener('click', handlePlayMenu);

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
  mp3player.volume = e.target.value / 20;
});

mp3bar.parentNode.addEventListener('click', function (e) {
  if (window.getSelection().toString())
    return;
  mp3player.currentTime = (e.pageX - this.offsetLeft) / this.clientWidth * mp3player.duration;
  e.preventDefault();
});

mp3player.addEventListener('timeupdate', function () {
  var progress = mp3player.currentTime / mp3player.duration;
  mp3bar.style.width = progress * 100 + '%';
  mp3time.innerHTML = toMMSS(mp3player.currentTime);
  if (!mp3length.innerHTML)
    mp3length.innerHTML = toMMSS(mp3player.duration); //delete when actual duration info has been getted

  if (progress == 1) {
    if (mp3options.repeat) {
      mp3player.currentTime = 0;
      mp3bar.style.width = '0%';
      startPlaying();
      return;
    }
    playMusic(null, null, 'next');
  }
});

function toMMSS(sec_num) {
  var minutes = Math.floor(sec_num / 60);
  var seconds = Math.floor(sec_num - minutes * 60);
  if (seconds < 10) seconds = '0' + seconds;
  return minutes+':'+seconds;
}




mp3player.addEventListener('progress', function () {
  var len = mp3player.buffered.length;

  if (mp3player.buffered.length) {
    var start = mp3player.buffered.start(len - 1) / mp3player.duration;
    var end = mp3player.buffered.end(len - 1) / mp3player.duration;
    //                                                       hhmp3load.style.left = start * 100 + '%';
    mp3load.style.width = end * 100 + '%';
  } else {
    mp3load.style.left = 0;
    mp3load.style.width = 0;
  }
});


function playMusic(target, add, order) {
  if (!target)
    target = currentSong;
  if (target == null)
    return;

  if (order) {
    if (order == 'next') {
      if (mp3options.random) {
        if (target.parentNode) {
          var children = target.parentNode.children;
          target = children[Math.floor(Math.random() * children.length) % children.length];
        } else
          return info.error.show('Не удается загрузить исходный список');
      } else {
        if (target.nextElementSibling)
          target = target.nextElementSibling;
        else
          return info.error.show('Последний файл в списке');
      }
    } else if (order == 'prev') {
      if (target.previousElementSibling)
        target = target.previousElementSibling;
      else
        return info.error.show('Первый файл в списке');
    }
  }

  if (add == 'plus') {
    console.log('plus');
  } else /*if (add == 'play' || target.tagName == 'TR')*/ {
    if (!currentSong || currentSong.dataset.href != target.dataset.href) {
      currentSong = target;
      mp3player.setAttribute('src', target.dataset.href);
      mp3info.innerHTML = '<b>' + target.dataset.title + '</b><br>' + target.dataset.artist + ' - ' + target.dataset.album;
      mp3length.innerHTML = target.dataset.duration || '';
      mp3load.style.width = 0;
    }
    mp3player.currentTime = 0;
    mp3time.innerHTML = '0:00';
    mp3bar.style.width = '0%';
    mp3load.style.left = 0;
    startPlaying();
  }
}

function hanldeSpaClick(target, options) {
  playMusic(target, options);
}

module.exports.hanldeSpaClick = hanldeSpaClick;
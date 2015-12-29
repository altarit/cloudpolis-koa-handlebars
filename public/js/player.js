var mp3 = (function () {

  var mp3player = document.getElementById('player');
  var mp3bar = document.getElementById('musicbar');
  var mp3time = document.getElementsByClassName('musictime')[0];
  var mp3length = document.getElementsByClassName('musiclength')[0];
  var mp3options = {
    repeat: false,
    random: false,
    volumeoff: false
  };


  var actions = {
    prev: function (e) {
      playMusic(null, null, 'prev');
    },
    next: function (e) {
      playMusic(null, null, 'next');
    },
    play: function (e) {
      if (mp3player.paused) {
        mp3player.play();
        e.target.classList.remove('fa-play');
        e.target.classList.add('fa-pause');
        mp3player.setAttribute('autoplay', '');
      } else {
        mp3player.pause();
        e.target.classList.add('fa-play');
        e.target.classList.remove('fa-pause');
        mp3player.removeAttribute('autoplay');
      }
    },
    repeat: function (e) {
      mp3options.repeat = !mp3options.repeat;
      e.target.classList.toggle('active', mp3options.repeat);
    },
    random: function (e) {
      mp3options.random = !mp3options.random;
      e.target.classList.toggle('active', mp3options.random);
    },
    volumeoff: function (e) {
      mp3options.volumeoff = !mp3options.volumeoff;
      e.target.classList.toggle('active', mp3options.volumeoff);
      e.target.classList.toggle('fa-volume-off', mp3options.volumeoff);
      e.target.classList.toggle('fa-volume-up', !mp3options.volumeoff);
      mp3player.muted = mp3options.volumeoff;
    },
    playlist: function (e) {
      $('#playmenu').stop(true,true).toggle("slide", { direction: "right" }, 200);
    },
    pl_current: function (e) {
      if (!window.app.currentSong)
        return app.error.show('Ничего не вопроизводится');
      if (!window.app.currentSong.parentNode)
        return app.error.show('Нет ссылки на список');
      if (!window.app.currentSong.parentNode.children)
        return app.error.show('Список пуст');
      var pl = document.getElementById('playlist');
      var templateFunction = Handlebars.compile(document.getElementById('hb_copy_songlist').innerHTML);
      $(document.getElementById('playlist')).html(templateFunction(window.app.currentSong.parentNode));
    },
    pl_clean: function (e) {
      document.getElementById('playlist').innerHTML = '';
    }
  };

  mp3player.start = function () {
    var pausebutton = document.getElementsByClassName('button-pause')[0];
    mp3player.play();
    pausebutton.classList.remove('fa-play');
    pausebutton.classList.add('fa-pause');
    mp3player.setAttribute('autoplay', '');
  };


  playermenu.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.tagName == 'A')
      actions[e.target.getAttribute('data-action')](e);
  });

  playmenu.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.tagName == 'A')
      actions[e.target.getAttribute('data-action')](e);
  });

  document.getElementById('volume').addEventListener('change', function (e) {
    mp3player.volume = e.target.value / 20;
  });

  mp3bar.parentNode.addEventListener('click', function (e) {
    if (window.getSelection().toString())
      return;
    mp3player.currentTime = (e.pageX - this.offsetLeft) / this.clientWidth * mp3player.duration;
    e.preventDefault();
  });

  player.addEventListener('timeupdate', function () {
    var progress = mp3player.currentTime / mp3player.duration;
    mp3bar.style.width = progress * 100 + '%';
    //mp3time.innerHTML = Math.floor(mp3player.currentTime / 60) + ':' + Math.floor(mp3player.currentTime % 60);

    if (progress == 1) {
      if (mp3options.repeat) {
        mp3player.currentTime = 0;
        mp3bar.style.width = '0%';
        return;
      }
      playMusic(null, null, 'next');
    }
  });


  function playMusic(target, add, order) {
    if (!target)
      target = window.app.currentSong;
    if (target == null)
      return;

    if (order) {
      if (order == 'next') {
        if (mp3options.random) {
          if (target.parentNode) {
            var children = target.parentNode.children;
            target = children[Math.floor(Math.random() * children.length) % children.length];
          } else
            return app.error.show('Не удается загрузить исходный список');
        } else {
          if (target.nextElementSibling)
            target = target.nextElementSibling;
          else
            return app.error.show('Последний файл в списке');
        }
      } else if (order == 'prev') {
        if (target.previousElementSibling)
          target = target.previousElementSibling;
        else
          return app.error.show('Первый файл в списке');
      }
    }

    if (add == 'plus') {
      console.log('plus');
    } else /*if (add == 'play' || target.tagName == 'TR')*/ {
      window.app.currentSong = target;
      document.getElementById('player').setAttribute('src', target.dataset.href);
      document.getElementById('musicinfo').innerHTML = '<b>' + target.dataset.title + '</b><br>' + target.dataset.artist + ' - ' + target.dataset.album;
      mp3bar.style.width = '0%';
      mp3player.start();
    }
  }


  return {
    playMusic: playMusic
  };
})();
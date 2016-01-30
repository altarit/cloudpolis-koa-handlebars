$(function() {
  console.log("chat.js loaded");
  var chat = io.connect(window.location.origin+'/chat');
  /*'http://localhost:3000'*/

  var sendButton = document.getElementById('chat-button-send');
  var input = document.getElementById('chat-input');
  var messageLog = document.getElementById('chat-messagelog');

  sendButton.addEventListener('click', function (e) {
    var text = input.value;
    chat.emit('message', text, function() {
      console.log(text);
      printMessage('You', text);
    });
    input.value = "";
  });


  chat.on('news', function (text) {
    printMessage('Server', text)
    //console.log(data);
    //chat.emit('my other event', {my: 'data'});
  });

  chat.on('join', function (username) {
    var row = document.createElement('div');
    row.innerHTML = '<i><b>' + username + '</b> joined to this chat </i>';
    messageLog.appendChild(row);
  });

  chat.on('leave', function (username) {
    var row = document.createElement('div');
    row.innerHTML = '<i><b>' + username + '</b> leaved from this chat </i>';
    messageLog.appendChild(row);
  });
  
  chat.on('message', function (sender, text) {
    printMessage(sender, text);
  });

  function printMessage(username, text) {
    var row = document.createElement('div');
    row.innerHTML = '<b>'+username+'</b>: ' + text;
    messageLog.appendChild(row);
  };
});
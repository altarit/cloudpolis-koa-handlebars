webpackJsonp_name_([1],{

/***/ 31:
/***/ function(module, exports) {

	console.log("chat.js loaded");
	var chat = io.connect(window.location.origin+'/chat');
	var sendButton;
	var input;
	var messageLog;
	
	function prepare() {
	  sendButton = document.getElementById('chat-button-send');
	  input = document.getElementById('chat-input');
	  messageLog = document.getElementById('chat-messagelog');
	  sendButton.addEventListener('click', eventSendButtonClick);
	}
	
	
	chat.on('news', function (text) {
	  printMessage('Server', text);
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
	
	function eventSendButtonClick() {
	  var text = input.value;
	  chat.emit('message', text, function() {
	    console.log(text);
	    printMessage('You', text);
	  });
	  input.value = "";
	}
	
	function printMessage(username, text) {
	  var row = document.createElement('div');
	  row.innerHTML = '<b>'+username+'</b>: ' + text;
	  messageLog.appendChild(row);
	}
	
	module.exports.prepare = prepare;

/***/ }

});
//# sourceMappingURL=1.1.js.map
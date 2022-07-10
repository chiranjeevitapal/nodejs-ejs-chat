const socket = io();
const chatUsername = document.querySelector('#chat-username');
const chatMessage = document.querySelector('#chat-message');

socket.on('connect', () => {
  var chatForm = document.forms.chatForm;

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      socket.emit('postMessage',{
        username: chatUsername.value,
        message: chatMessage.value,
      });
      chatMessage.value='';
      chatMessage.focus();
    }); //chatform event

    socket.on('updateMessages', (data) => {
      showMessage(data);
    }); //updateMessages
  } //chatform
}); //socket

function showMessage(data) {
  var chatDisplay = document.querySelector('.chat-display');
  var newMessage = document.createElement('p');

  if (chatUsername.value == data.username) {
    newMessage.className = 'bg-success chat-text';
  } else {
    newMessage.className = 'bg-info text-warning chat-text';
  }

  newMessage.innerHTML = '<strong>' + data.username + '</strong>: ' + data.message;
  chatDisplay.insertBefore(newMessage, chatDisplay.firstChild);
}

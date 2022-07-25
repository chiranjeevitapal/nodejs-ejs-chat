const socket = io();
const chatUsername = document.querySelector('#username');
const userGender = document.querySelector('#gender');
let privateRoom = '';
let user = {};

socket.on('connect', () => {
    const chatForm = document.forms.chatForm;
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!chatUsername.value || !userGender.value) {
                showMessage('All fields are required', true);
                return;
            }
            console.log(socket.id);
            user = {
                id: socket.id,
                username: chatUsername.value,
                gender: userGender.value,
                isAvailable: true
            }
            socket.emit('user-joined', user);
        });

        socket.on('online-users', (message) => {
            console.log(message.description);
            document.getElementById('online-users').textContent = message.description;
        });

        socket.on('update-message', (user, message) => {
            showMessage(message, false);
            socket.emit('find-a-match', user);
        });
        socket.on('start-private-chat', (room) => {
            startPrivateChat(room);
        });
        socket.on('server-message', (user, message, socketId) => {
            addMessageToUI(user, socketId, message);
        });
    } //chatform
}); //socket

function startPrivateChat(room) {
    console.log(room);
    privateRoom = room;
    document.getElementById('pre-chat-section').style.display = "none";
    document.getElementById('chat-section').style.display = "block";
}

function showMessage(message, isError) {
    document.getElementById('message-row').style.display = "block";
    if (isError) {
        document.getElementById('info-message').style.display = "none";
        document.getElementById('error-message').style.display = "block";
        document.getElementById('error-message').textContent = message;
        document.getElementById('form-row').style.display = "block";
        document.getElementById('finding-match-row').style.display = "none";

    } else {
        document.getElementById('info-message').style.display = "block";
        document.getElementById('error-message').style.display = "none";
        document.getElementById('info-message').textContent = message;
        document.getElementById('form-row').style.display = "none";
        document.getElementById('finding-match-row').style.display = "block";
    }
}

function sendMessage() {
    const message = document.getElementById('chat-box').value;
    console.log(message);
    if(message && message.trim().length > 0) {
        socket.emit('client-message', user, privateRoom, message);
    }
}

function addMessageToUI(_user, socketId, message) {
    let badgeStyle = 'badge bg-info text-dark chat-message text-wrap';
    let floatStyle = 'float-start';
    const _username = _user.username === chatUsername.value ? 'You':  _user.username;
    if (socketId !== socket.id) {
        badgeStyle = 'badge bg-warning text-dark chat-message text-wrap';
        floatStyle = 'float-end';
    }
    const msg = `<div class="row mt-2"><div class="col-12"><b class="${floatStyle}"><small>${_username}</small></b><br\><span class="${badgeStyle} ${floatStyle}"><b>${message}</b></span></div></div>`;
    document.getElementById('private-messages').innerHTML += msg;

    document.getElementById('chat-box').value = '';
}
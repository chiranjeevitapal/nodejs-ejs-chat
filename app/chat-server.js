const express = require('express');
const app = express();
const moment = require("moment");
const io = require("socket.io")({
    allowEIO3: true // false by default
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.static('app/public'));
app.use(express.static('node_modules'));
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});

// ROUTES
app.use(require('./routes/chat-controller'));

let chatServer = app.listen(app.get('port'), () => {
    console.log('Listening on port ' + app.get('port'));
});

// CHAT SERVER
const onlineUsers = [];
const sockets = [];
io.attach(chatServer);
io.on('connection', (socket) => {
    io.emit('online-users', {description: onlineUsers.length + ' users online'})
    socket.on('user-joined', (user) => {
        onlineUsers.push(user);
        sockets.push(socket);
        io.emit('online-users', {description: onlineUsers.length + ' users online'})
        socket.emit('update-message', user, `'${user.username}' you have joined the chat`);
    });
    socket.on('find-a-match', (currentUser) => {
        const availableUsers = onlineUsers.filter(u => u.id !== currentUser.id && u.isAvailable);
        if (availableUsers.length === 0) {
            console.log('Searching ... ')
        } else {
            const randomIndex = Math.floor(Math.random() * availableUsers.length);
            const matchUser = availableUsers[randomIndex];
            const matchUserSocketId = sockets.indexOf(sockets.find(s => s.id === matchUser.id))
            availableUsers.splice(randomIndex, 0);
            onlineUsers.find(user => user.id === currentUser.id).isAvailable = false;
            onlineUsers.find(user => user.id === matchUser.id).isAvailable = false;
            const room = `privateRoom ${currentUser.id} And ${matchUser.id}`;
            socket.join(room);
            sockets[matchUserSocketId].join(room);
            io.sockets.in(room).emit('start-private-chat', room);
        }
    });
    socket.on('client-message', (user, room, message) => {
        io.sockets.in(room).emit('server-message', user, message, socket.id);
    });
    socket.on('disconnect', (user) => {
        onlineUsers.splice([onlineUsers.indexOf(onlineUsers.find(user => user.id === user.id))], 1);
        io.emit('online-users', {description: onlineUsers.length + ' users online'})
        sockets.splice(sockets.indexOf(sockets.find(s => s.id === socket.id)), 1);
    });
});




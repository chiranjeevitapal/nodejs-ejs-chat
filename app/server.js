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
app.use(require('./routes/home/home-controller'));
app.use(require('./routes/feedback/feedback-controller'));
app.use(require('./routes/api/api-controller'));
app.use(require('./routes/chat/chat-controller'));

let server = app.listen(app.get('port'), () => {
    console.log('Listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', (socket) => {
    socket.on('postMessage', (data) => {
        io.emit('updateMessages', data);
    });
});


const express = require('express');
const app = express();
const dataFile = require('./data/data.json');
const io = require("socket.io")({
  allowEIO3: true // false by default
});

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Roux Meetups';
app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(express.static('node_modules'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));

let server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', (socket) => {
  socket.on('postMessage', (data) => {
    io.emit('updateMessages', data);
  });
});


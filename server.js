const express = require('express');
const path = require('path');

var port = 4000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});


console.log(`\nServer running in: ${port}`)


let messages = []
let connectionsInfo = {
    connections: 0
}

io.on('connection', socket => {

    connectionsInfo.connections = server.getConnections((err, count) => {
        return count;
    });
    
    socket.emit('ConnectionsInfo', connectionsInfo)
    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
});

server.listen(process.env.PORT || port);
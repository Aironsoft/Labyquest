var PORT = 8008;

var options = {
//    'log level': 0
};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);

var Maze = require('./models/maze.js');//получение модели лабиринта

server.listen(PORT);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


var countGames = 0, countPlayers = [], Game = new Maze();

io.sockets.on('connection', function (client) {
    
    if (Game.users.indexOf(client) == -1)//если такого игрока нетв списке
        Game.users.push(client);//добавляем нового игрока
    
    io.sockets.emit('stats', [
        'Всего игр: ' + countGames,
        'Уникальных игроков: ' + Object.keys(countPlayers).length,
        'Сейчас игр: ' + Object.keys(Game.games).length,
        'Сейчас играет: ' + Object.keys(Game.users).length
    ]);

    client.on('message', function (message) {
        try {
            client.emit('message', message);
            client.broadcast.emit('message', message);
        } catch (e) {
            userId = Game.users.indexOf(client);
            if (userId != -1)
                delete Game.users[userId];
            console.log(e);
            client.disconnect();
        }
    });
});
//io.sockets.on('connection', function (client) {
//    client.on('message', function (message) {
//        try {
//            client.emit('message', message);
//            client.broadcast.emit('message', message);
//        } catch (e) {
//            console.log(e);
//            client.disconnect();
//        }
//    });
//});
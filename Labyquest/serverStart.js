var PORT = 8008;

var options = {
//    'log level': 0
};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);

var Labyquest = require('./models/Labyquest.js');//получение модели лабиринта
var Room = require('./models/Labyquest.js');//получение модели комнаты

server.listen(PORT);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


var countGames = 0, countPlayers = [], Game = new Labyquest();
Game.rooms = [];
Game.users = [];

io.sockets.on('connection', function (client) {
    
    //if (Game.rooms === undefined)
    //    Game.rooms = [];
    //else if (Game.users.indexOf(client) == -1)//если такого игрока нет в списке
    //    Game.users.push(client);//добавляем нового игрока
    
    
    client.on('req_room', function () {
        
        //Game.start();
        if (Game.incompleateRoom == null)  //* if (Game.incompleateRoom ==- null)
            Game.incompleateRoom = new Room("комната" + (Math.round(Math.random() * 10000)));

        Game.incompleateRoom.addClient(client);
        client.join(Game.incompleateRoom.name);
        
        client.emit('room', Game.incompleateRoom.name);
        
        if (Game.rooms == undefined)
            Game.rooms = [];
        Game.rooms[client.id] = Game.incompleateRoom;
        
        console.log("client id=" + client.id + "  incompleateRoom.name=" + Game.incompleateRoom.name);

        if (!Game.incompleateRoom.hasPlace()) {
            console.log("has no place");
            io.sockets.in(Game.incompleateRoom.name).emit('compleate_room', '');
            Game.incompleateRoom = null;
            
        }
    });
    
    
    client.on('message', function (message) {
        try {
            io.sockets.in(Game.rooms[client.id].name).emit('message', message);
          //  client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
    

    io.sockets.emit('stats', [
        'Всего игр: ' + countGames,
        'Уникальных игроков: ' + Object.keys(countPlayers).length,
        'Сейчас игр: ' + Object.keys(Game.rooms).length,
        'Сейчас играет: ' + Object.keys(Game.users).length
    ]);

    //client.on('message', function (message) {
    //    try {
    //        client.emit('message', message);
    //        client.broadcast.emit('message', message);
    //    } catch (e) {
    //        userId = Game.users.indexOf(client);
    //        if (userId != -1)
    //            delete Game.users[userId];
    //        console.log(e);
    //        client.disconnect();
    //    }
    //});

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
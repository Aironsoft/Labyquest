var util = require('util'), EventEmitter = require('events').EventEmitter;

var Labyquest = module.exports = function () {

    
    //this.games = [];// Массив [id игры = объект игры]
    
    this.users = [];// Массив [подключённых пользователей = id игры]
    
    this.free = [];// Массив пользователей, ожидающих оппонентов для начало игры
    
    // Размеры поля
    this.x = 30;
    this.y = 30;

    // Время на игру (минуты)
    this.stepsToWin = 4;
    

    /////
    this.rooms = {};
    this.incompleateRoom = null;
}
util.inherits(Labyquest, EventEmitter);



var Room = module.exports = function (name) {

    EventEmitter.call(this);// Инициализируем события

    this.name = name;
    var clients = this.clients = [] ///var clients = this.clients = []
    
    //this.addClient = function (client) {
    //    if (clients.length < 2)
    //        clients.push(client);
    //};
    
    this.hasPlace = function () {
        
        return this.clients.length < 2;
    }
}
util.inherits(Room, EventEmitter);


/**
 * Запускаем игру
 */
Labyquest.prototype.start = function () {
    
    if (this.incompleateRoom === null)
        this.incompleateRoom = new Room("комната" + (Math.round(Math.random() * 10000)));
    
}


/**
 * Сделан ход
 */
Room.prototype.addClient = function (client) {
    if (this.clients.length < 2)
        this.clients.push(client);
}
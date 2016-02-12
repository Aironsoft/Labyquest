var util = require('util'), EventEmitter = require('events').EventEmitter;

var Maze = module.exports = function () {

    EventEmitter.call(this);// Инициализируем события
    
    this.games = [];// Массив [id игры = объект игры]
    
    this.users = [];// Массив [подключённых пользователей = id игры]
    
    this.free = [];// Массив пользователей, ожидающих оппонентов для начало игры
    
    // Размеры поля
    this.x = 30;
    this.y = 30;

    // Время на игру (минуты)
    this.stepsToWin = 4;
}
util.inherits(Maze, EventEmitter);
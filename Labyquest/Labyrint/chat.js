$(document).ready(function () {
    var socket = io.connect('http://localhost:8008');
    var name = 'Игрок_' + (Math.round(Math.random() * 10000));
    var messages = $("#messages");
    var message_txt = $("#message_text")
    $('.chat .nick').text(name);
    
    function msg(nick, message) {
        var m = '<div class="msg">' +
                    '<span class="user">' + safe(nick) + ':</span> ' 
                    + safe(message) +
                    '</div>';
        messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
    }
    
    function msg_system(message) {
        var m = '<div class="msg system">' + safe(message) + '</div>';
        messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
    }
    
    socket.on('connecting', function () {
        msg_system('Соединение...');
    });
    
    socket.on('connect', function () {
        msg_system('Соединение установлено!');
    });
    
    socket.on('message', function (data) {
        msg(data.name, data.message);
        message_txt.focus();
    });
    
    $("#message_btn").click(function () {
        var text = $("#message_text").val();
        if (text.length <= 0)
            return;
        message_txt.val("");
        socket.emit("message", { message: text, name: name });
    });
    
    function safe(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});
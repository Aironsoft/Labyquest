//$(document).ready(function () {
//    var socket = io.connect('http://localhost:8008');
//    var name = 'Игрок_' + (Math.round(Math.random() * 10000));
//    var messages = $("#messages");
//    var message_txt = $("#message_text")
//    $('.chat .nick').text(name);
    
//    function msg(nick, message) {
//        var m = '<div class="msg">' +
//                    '<span class="user">' + safe(nick) + ':</span> ' 
//                    + safe(message) +
//                    '</div>';
//        messages
//                    .append(m)
//                    .scrollTop(messages[0].scrollHeight);
//    }
    
//    function msg_system(message) {
//        var m = '<div class="msg system">' + safe(message) + '</div>';
//        messages
//                    .append(m)
//                    .scrollTop(messages[0].scrollHeight);
//    }
    
//    socket.on('connecting', function () {
//        msg_system('Соединение...');
//    });
    
//    socket.on('connect', function () {
//        msg_system('Соединение установлено!');
//    });
    
//    socket.on('reconnect', function () {
//        $('#reload').show();
//        $('#connect-status').html('Переподключились, продолжайте игру');
//        _gaq.push(['_trackEvent', 'WebSocket', 'Reconnect']);
//    });
//    socket.on('reconnecting', function () {
//        $('#reload').hide();
//        $('#status').html('Соединение с сервером потеряно, переподключаемся...');
//        _gaq.push(['_trackEvent', 'WebSocket', 'Reconnecting']);
//    });
    
//    socket.on('disconnect', function () {
//        // Если один из игроков отключился, посылаем об этом сообщение второму
//        // Отключаем обоих от игры и удаляем её, освобождаем память
//        Game.end(socket.id.toString(), function (gameId, opponent) {
//            io.sockets.socket(opponent).emit('exit');
//            closeRoom(gameId, opponent);
//        });
//        console.log('%s: %s - disconnected', socket.id.toString(), socket.handshake.address.address);
//    });

//    socket.on('message', function (data) {
//        msg(data.name, data.message);
//        message_txt.focus();
//    });
    
//    $("#message_btn").click(function () {
//        var text = $("#message_text").val();
//        if (text.length <= 0)
//            return;
//        message_txt.val("");
//        socket.emit("message", { message: text, name: name });
//    });
    
    
//    // Статистика
//    socket.on('stats', function (arr) {
//        var stats = $('#stats');
//        stats.find('div').not('.turn').remove();
//        //for (val in arr) {
//        //    stats.prepend($('<div/>').attr('class', 'ui-state-hover ui-corner-all').html(arr[val]));
//        //}

//        var m = '<div class="msg">' +
//                    '<span class="user">' + arr[0] + '.</span> ' 
//                     + arr[1] + '.</span> ' 
//                     + arr[2] + '.</span> ' 
//                     + arr[3] + '.'
//                      + '</div>';
//        stats
//                    .append(m)
//    });

    
//    function safe(str) {
//        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//    }

//});


$(document).ready(function () {
    var socket = io.connect('http://localhost:8008');
    var name = 'Игрок_' + (Math.round(Math.random() * 10000));
    var messages = $("#messages");
    var message_txt = null;
    var room = null;
    
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
        socket.emit('req_room', '');
        msg_system('Соединение...');
    });
    
    socket.on('connect', function () {
               
    });
    
    
    
    socket.on('message', function (data) {
        msg(data.name, data.message);
        message_txt.focus();
    });
    
    socket.on('room', function (data) {
        
        room = data;
    });
    
    socket.on('compleate_room', function (data) {
        msg_system('Соединение установлено!');
        
        $('#chatDiv').append(' <div class="panel">' +
                '<span class="nick"></span> <input type="text" name="message_text" id="message_text">' +
                '<button type="button" id="message_btn">Отправить</button>' +
                '</div>').scrollTop(messages[0].scrollHeight);
        
        message_txt = $("#message_text");
        
        $("#message_btn").click(function () {
            var text = $("#message_text").val();
            if (text.length <= 0)
                return;
            message_txt.val("");
            socket.emit("message", { message: text, name: name });
        });
                                
    });
    
    
    //// Статистика
    //socket.on('stats', function (arr) {
    //    var stats = $('#stats');
    //    stats.find('div').not('.turn').remove();
    //    //for (val in arr) {
    //    //    stats.prepend($('<div/>').attr('class', 'ui-state-hover ui-corner-all').html(arr[val]));
    //    //}
    
    //    var m = '<div class="msg">' +
    //                '<span class="user">' + arr[0] + '.</span> ' 
    //                    + arr[1] + '.</span> ' 
    //                    + arr[2] + '.</span> ' 
    //                    + arr[3] + '.'
    //                    + '</div>';
    //    stats
    //                .append(m)
    //});
    
    
    function safe(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});
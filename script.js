var field = document.getElementById("field"),
    user = document.getElementById("user"),
    chat =  document.getElementById("chat");
//    var ws = new WebSocket("ws://10.132.225.231:591/");
    var ws = new WebSocket("ws://localhost:591/");

ws.onmessage = function(message) {
    chat.value = message.data + '\n' + chat.value;

};

ws.onopen = function(){
    field.addEventListener("keydown", function(event) {
        if(event.which == 13) {
            ws.send(user.value +"> "+ field.value);
            field.value = "";   
        }
    });
};

   
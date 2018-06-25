class Bot {
    constructor(name) {
        this.name = name;

        this.replays = {"ji":[]}
        
    }
    sayHello (){
        return this.name + ">" + "Привет!";
    }
    parseMessage(message){
        var name, text , x;
        x = message.indexOf(">");
        name = message.substr(0, x);
        text = message.substr(x+1, message.length);
        return {"name":name, "message":text.trim().toLowerCase()}
    }

    getReplay(message){
        var m = this.parseMessage(message);
        console.log(m);

        //var replay = this.name + "> " + m.name + "! не говори мне --" + m.message +"--";
        var replay = this.name + "> " + this.findReplay(m.message);
        return replay;
    }

    findReplay(text){
        var r = this.replays[text]; 
        if(r){
            return r[Math.floor(Math.random() * r.length)];
        }
        else
            return "Не понимаю тебя";
    }

    saveReplays(){
        var fs = require("fs");
        var s = JSON.stringify(this.replays);

        fs.writeFile("bot.txt", s);
    }

    loadReplays(){
        var fs = require("fs");
        fs.readFile("bot.txt", {flag:"r"}, function(err, content) {
            console.log(content.toString());

           // this.replays = JSON.parse(content.toString());
            

            //console.log(this.replays.toString());
        });        
        
    }
}

var wss = require("ws").Server;

var server = new wss({port : 591});

var clients = new Set();
var messages = [];
var chatBot = new Bot("Fedr");
chatBot.loadReplays();

var fs = require("fs");
fs.readFile("messages.txt", {flag:"a+"}, function(err, content) {
    content;
    console.log(content.toString());
    messages.push(content.toLocaleString());

});

server.on("connection", function(socket) {
    clients.add(socket);
    for(var m of messages) {
        socket.send(m);
    }

    socket.send(chatBot.sayHello());

    socket.on("message", function(message) {
        chatBotMessage = chatBot.getReplay(message);

        messages.push(message);

        s ="";
        for(var m of messages) {
            s = m+ '\n' + s;
        }
        fs.writeFile("messages.txt",  s);


        for(var inter of clients) {
            inter.send(message);
            inter.send(chatBotMessage);
        }
    });

    socket.on("close", function ( ){
        clients.delete(socket);
    });
});

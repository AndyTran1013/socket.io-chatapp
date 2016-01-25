var express = require("express");
var expApp = express();
var http =require("http").Server(expApp);
var port = process.env.PORT || 8000;
var io = require("socket.io")(http);

expApp.use(express.static(__dirname));

var users = []; //store users

io.on("connection", function(socket){
	console.log ("A user connected");

	socket.on("addUser",function(name){
		socket.username = name;
		users.push(name);
		io.emit("joinChat", {
			users: users,
			name: socket.username
		});
	});
	
	socket.on("disconnect",function(){
		if (socket.username){
			users.splice(users.indexOf(socket.username),1);
			socket.broadcast.emit("leave", {
				users: users,
				name: socket.username
			});
		}
	});

	socket.on("newMsg", function(msg){
		io.emit("newMsg", {
			name: socket.username,
			msg: msg
		});
	});
	
});

http.listen(port, function(){
	console.log ("listening on %d", port);
});


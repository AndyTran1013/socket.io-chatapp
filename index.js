var express = require("express");
var expApp = express();
var http =require("http").Server(expApp);
var port = process.env.PORT || 8000;
var io = require("socket.io")(http);

expApp.use(express.static(__dirname));

var users = []; //store users

io.on("connection", function(socket){
	console.log ("a user connected");

	socket.on("addUser",function(name){
		socket.username = name;
		users.push(name);
		socket.emit("joinChat", users);
		console.log(socket.username);
	});
	
	socket.on("disconnect",function(){
		users.slice(users.indexOf(users.name),1);
		socket.emit("leave", {
			users: users,
			name: socket.username
		});
	});

});

http.listen(port, function(){
	console.log ("listening on %d", port);
});


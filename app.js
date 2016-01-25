
var app  = angular.module("chatApp",[]);
var msgBox = document.getElementById("msg-box");

app.controller("chatCtrl", ["$scope","socket", function($scope, socket){
	$scope.users = [];
	$scope.messages = [];
	$scope.hidePrompt = false;


	$scope.appendUser = function(){
		socket.emit("addUser", $scope.username);
		$scope.hidePrompt = true;
	};
	
	$scope.addMsg = function(){
		socket.emit("newMsg", $scope.msg);
		$scope.msg = "";
	};

	socket.on("joinChat", function(data){
		$scope.users = data.users;
		$scope.messages.push(data.name + " has connected.");
	});

	socket.on("leave", function(data){
		$scope.users = data.users;
		$scope.messages.push(data.name + " has disconnected.");
	});

	socket.on("newMsg", function(data){
		$scope.messages.push(data.name + ": " + data.msg);
	});


}]);

app.factory("socket", function($rootScope){
	var socket = io.connect();
	return{
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket,args);
				});
			});
		},
		emit: function (eventName, data, callback){
      socket.emit(eventName, data, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
	};
});

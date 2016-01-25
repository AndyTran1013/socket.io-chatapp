
var app  = angular.module("chatApp",[]);

app.controller("chatCtrl", ["$scope","socket", function($scope, socket){
	$scope.users = [];
	$scope.messages = [];
	$scope.hidePrompt = false;

	$scope.appendUser = function(){
		socket.emit("addUser", $scope.username);
	};
	
	socket.on("joinChat", function(data){
		$scope.users = data;
		$scope.hidePrompt = true;
		console.log(data);
	});

	socket.on("leave", function(data){
		$scope.users = data.users;
		$scope.messages.push(data.name + "has left.");
		console.log(data.name);
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
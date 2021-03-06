// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Users', 'CurrentOrder', 'UserSelection', 'UserStats',
    function ($scope, $routeParams, $location, Authentication, Users, CurrentOrder, UserSelection, UserStats) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;
        $scope.currentOrder = CurrentOrder;
        $scope.currentOrder.nameFilter = {fullName: ""};
        $scope.userSelection = UserSelection;
        $scope.userStats = UserStats;
        $scope.loading = false;

        $scope.viewOne = function (user) {
            $location.path('users/' + user._id);
        };

        $scope.editOne = function (user) {
            $location.path('users/' + user._id + '/edit');
        };

        $scope.selectForOrder = function(user, index) {
            if ($scope.currentOrder.nameFilter.fullName.length > 0) {
                $scope.userSelection.userIndex = index;
                // $scope.currentOrder.creator = user;
                $scope.currentOrder.creator = Users.get({
                    userId: user.id
                });
                $scope.currentOrder.step = 2;
            }
        }

        $scope.addLetter = function(letter) {
            $scope.currentOrder.nameFilter.fullName += letter;
            $scope.currentOrder.step = 1;
        }

        $scope.removeLetter = function() {
            $scope.currentOrder.nameFilter.fullName = $scope.currentOrder.nameFilter.fullName.slice(0, -1);
            if ($scope.currentOrder.nameFilter.fullName.length == 0) {
                $scope.currentOrder.step = 0;
            }
        }

        // Create a new controller method for creating new users
        $scope.create = function() {
        	// Use the form fields to create a new user $resource object
            var user = new Users({
                title: this.title,
                content: this.content
            });

            // Use the user '$save' method to send an appropriate POST request
            user.$save(function(response) {
            	// If an user was created successfully, redirect the user to the user's page 
                $location.path('users/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of users
        $scope.find = function() {
            var query = {};
            UserStats.reset();
            // Use the user 'query' method to send an appropriate GET request
            $scope.users = Users.query(query, function (users) {
                for (var i = 0; i < users.length-1; i++) {
                    $scope.userStats.totalBalance += users[i].balance;
                }
            }, function (errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a single user
        $scope.findOne = function() {
        	// Use the user 'get' method to send an appropriate GET request
            $scope.user = Users.get({
                userId: $routeParams.userId
            });
        };

        // Create a new controller method for toggeling auto add for a user
        $scope.toggleAutoAdd = function () {
            $scope.user.$toggleAutoAdd();
        }

        // Create a new controller method for updating a single user
        $scope.update = function(deposit) {
            $scope.loading = true;
            if(!isNaN(parseFloat(deposit))) {
                $scope.user.balance += parseFloat(deposit.replace(',', '.'));
            }
        	// Use the user '$update' method to send an appropriate PUT request
            $scope.user.$update(function(user) {
                // If an user was updated successfully, redirect the user to the user's page
                $location.path('users/' + $scope.user._id);
                $scope.loading = !true;
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
                $scope.loading = !true;
            });
        };

        // Create a new controller method for deleting a single user
        $scope.delete = function(user) {
        	// If an user was sent to the method, delete it
            if (user) {
            	// Use the user '$remove' method to delete the user
                user.$remove(function() {
                	// Remove the user from the users list
                    for (var i in $scope.users) {
                        if ($scope.users[i] === user) {
                            $scope.users.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the user '$remove' method to delete the user
                $scope.user.$remove(function() {
                    $location.path('users');
                });
            }
        };
    }
]);
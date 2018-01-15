// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'orders' controller
angular.module('orders').controller('OrdersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Orders',
    function($scope, $routeParams, $location, Authentication, Orders) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new orders
        $scope.create = function() {
        	// Use the form fields to create a new order $resource object
            var order = new Orders({
                title: this.title,
                content: this.content
            });

            // Use the order '$save' method to send an appropriate POST request
            order.$save(function(response) {
            	// If an order was created successfully, redirect the user to the order's page 
                $location.path('orders/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of orders
        $scope.find = function() {
        	// Use the order 'query' method to send an appropriate GET request
            $scope.orders = Orders.query();
        };

        // Create a new controller method for retrieving a single order
        $scope.findOne = function() {
        	// Use the order 'get' method to send an appropriate GET request
            $scope.order = Orders.get({
                orderId: $routeParams.orderId
            });
        };

        // Create a new controller method for updating a single order
        $scope.update = function() {
        	// Use the order '$update' method to send an appropriate PUT request
            $scope.order.$update(function() {
            	// If an order was updated successfully, redirect the user to the order's page 
                $location.path('orders/' + $scope.order._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single order
        $scope.delete = function(order) {
        	// If an order was sent to the method, delete it
            if (order) {
            	// Use the order '$remove' method to delete the order
                order.$remove(function() {
                	// Remove the order from the orders list
                    for (var i in $scope.orders) {
                        if ($scope.orders[i] === order) {
                            $scope.orders.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the order '$remove' method to delete the order
                $scope.order.$remove(function() {
                    $location.path('orders');
                });
            }
        };
    }
]);
// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'items' controller
angular.module('items').controller('ItemsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Items', 'CurrentOrder',
    function($scope, $routeParams, $location, Authentication, Items, CurrentOrder) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;
        $scope.currentOrder = CurrentOrder;

        $scope.currentName = "";
        $scope.currentSymbol = "";
        $scope.chartData = [];
        $scope.chartLabels = [];
        $scope.chartSeries = [];

        // CHART FUNCTIONS
        $scope.chartDatasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.chartOptions = {
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              }
            ]
          }
        };

        $scope.addToOrder = function(item) {
            // Checkif a user has been selected
            if ($scope.currentOrder.creator.hasOwnProperty('_id')) {
                // If the user has a positive balance
                if ($scope.currentOrder.creator.balance > 0 || $scope.currentOrder.creator.rebate) {
                    $scope.currentOrder.rebate = true;
                    $scope.currentOrder.total += item.price - $scope.currentOrder.rebatePerItem;
                }
                else {
                    $scope.currentOrder.total += item.price;
                }
                $scope.currentOrder.items.push(item);
                $scope.currentOrder.step = 3;
            }
        };

        // Create a new controller method for creating new items
        $scope.create = function() {
        	// Use the form fields to create a new item $resource object
            var item = new Items({
                title: this.title,
                content: this.content
            });

            // Use the item '$save' method to send an appropriate POST request
            item.$save(function(response) {
            	// If an item was created successfully, redirect the user to the item's page 
                $location.path('items/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method that automatically adds the previously ordered item to a new order 
        $scope.init = function () {
            Items.query().$promise.then(function(items) {
                $scope.items = items;
                if($scope.currentOrder.creator.autoAdd) {
                    var item = $scope.items.find(item => {
                        return item._id === $scope.currentOrder.creator.autoAdd
                      })                 
                    $scope.addToOrder(item);
                }
            });
        }

        // Create a new controller method for retrieving a list of items
        $scope.find = function() {
        	// Use the item 'query' method to send an appropriate GET request
            $scope.items = Items.query();
        };

        // Create a new controller method for retrieving a single item
        $scope.findOne = function() {
        };

        // Create a new controller method for updating a single item
        $scope.update = function() {
        	// Use the item '$update' method to send an appropriate PUT request
            $scope.item.$update(function() {
            	// If an item was updated successfully, redirect the user to the item's page 
                $location.path('items/' + $scope.item._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single item
        $scope.delete = function(item) {
        	// If an item was sent to the method, delete it
            if (item) {
            	// Use the item '$remove' method to delete the item
                item.$remove(function() {
                	// Remove the item from the items list
                    for (var i in $scope.items) {
                        if ($scope.items[i] === item) {
                            $scope.items.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the item '$remove' method to delete the item
                $scope.item.$remove(function() {
                    $location.path('items');
                });
            }
        };
    }
]);
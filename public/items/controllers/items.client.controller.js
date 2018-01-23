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
            if ($scope.currentOrder.creator.hasOwnProperty('_id')) {
                $scope.currentOrder.items.push(item);
                $scope.currentOrder.total += item.price;
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

        // Create a new controller method for retrieving a list of items
        $scope.find = function() {
        	// Use the item 'query' method to send an appropriate GET request
            $scope.items = Items.query();
        };

        // Create a new controller method for retrieving a single item
        $scope.findOne = function() {
        	// Use the item 'get' method to send an appropriate GET request
            // Items.query({ itemId: $routeParams.itemId }).$promise.then(function(data) {
            //     $scope.chartSeries.push($routeParams.itemId);
            //     $scope.currentName = data[0].name;
            //     $scope.currentSymbol = data[0].symbol;
            //     for (let index = 0; index < data.length; index++) {
            //         $scope.chartData.push(data[index].price_usd);
            //         $scope.chartLabels.push(new Date(data[index].last_updated*1000));
            //     }
            //   });
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
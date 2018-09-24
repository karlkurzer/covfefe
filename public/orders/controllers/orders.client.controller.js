// Invoke 'strict' JavaScript mode
"use strict";

// Create the 'orders' controller
angular.module("orders").controller("OrdersController", [
  "$scope",
  "$routeParams",
  "$location",
  "$timeout",
  "Authentication",
  "Orders",
  "CurrentOrder",
  "UserSelection",
  function(
    $scope,
    $routeParams,
    $location,
    $timeout,
    Authentication,
    Orders,
    CurrentOrder,
    UserSelection
  ) {
    // Expose the Authentication service
    $scope.authentication = Authentication;
    $scope.currentOrder = CurrentOrder;
    $scope.userSelection = UserSelection;
    $scope.aggregatedItems = [];

    $scope.reset = function() {
      $scope.currentOrder.reset();
      $scope.userSelection.reset();
    };

    $scope.viewOne = function(order) {
      $location.path("orders/" + order._id);
    };

    $scope.editOne = function(order) {
      $location.path("orders/" + order._id + "/edit");
    };

    $scope.removeFromOrder = function(index) {
      var item = $scope.order.items.splice(index, 1);
      $scope.order.total -= item[0].price;
    };

    $scope.removeFromCurrentOrder = function(index) {
      var item = $scope.currentOrder.items.splice(index, 1);
      $scope.currentOrder.total -= item[0].price;
      if (!$scope.currentOrder.items.length) {
        $scope.currentOrder.step = 2;
      }
    };

    $scope.shame = function() {
      var audio = new Audio("assets/audio/shame.mp3");
      audio.play();
    };

    // Create a new controller method for creating new orders
    $scope.create = function() {
      // Use the form fields to create a new order $resource object
      var order = new Orders({
        items: $scope.currentOrder.items,
        creator: $scope.currentOrder.creator._id,
        total: $scope.currentOrder.total
      });

      $scope.currentOrder.items = [];
      $scope.currentOrder.total = 0;

      // Use the order '$save' method to send an appropriate POST request
      order.$save(
        function(response) {
          // If an order was created successfully, redirect the user to the order's page
          if ($scope.currentOrder.creator.balance < $scope.currentOrder.total) {
            $scope.shame();
            $scope.currentOrder.step = 5;
          } else {
            $scope.currentOrder.step = 4;
          }
          $scope.currentOrder.creator.balance -= $scope.currentOrder.total;
          $timeout(function() {
            $scope.reset();
          }, 3000);
          // $scope.find(response.creator);
          // $location.path('orders/' + response._id);
        },
        function(errorResponse) {
          // Otherwise, present the user with the error message
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Create a new controller method for retrieving a list of orders
    $scope.find = function(query) {
      query = query ? query : {};
      // Use the order 'query' method to send an appropriate GET request
      $scope.orders = Orders.query(query);
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
      if ($scope.order.items.length == 0) {
        $scope.delete();
        return;
      }
      // Use the order '$update' method to send an appropriate PUT request
      $scope.order.$update(
        function() {
          // If an order was updated successfully, redirect the user to the order's page
          $location.path("orders/" + $scope.order._id);
        },
        function(errorResponse) {
          // Otherwise, present the user with the error message
          $scope.error = errorResponse.data.message;
        }
      );
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
          $location.path("/");
          $scope.reset();
        });
      }
    };
  }
]);

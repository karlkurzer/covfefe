// Invoke 'strict' JavaScript mode
"use strict";

// Create the 'statistics' controller
angular.module("statistics").controller("StatisticsController", [
  "$scope",
  "Authentication",
  "$http",
  "$routeParams",
  function($scope, Authentication, $http, $routeParams) {
    // Expose the authentication service
    $scope.authentication = Authentication;

    $scope.chartData = [];
    $scope.chartLabels = [];
    $scope.chartSeries = [];

    $scope.chartOptions = {
      title: {
        display: true,
        fontSize: 35
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontSize: 25
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 25
            }
          }
        ]
      }
    };

    $scope.getData = function() {
      switch ($routeParams.query) {
        case "distribution":
          $scope.getOrderDistribution();
          break;
        case "frequency":
          $scope.getOrderFrequency();
          break;
        case "stock":
          $scope.getItemStock();
          break;
        default:
          console.log("unknown query");
          break;
      }
    };

    $scope.getOrderFrequency = function() {
      var data = {
        data: undefined
      };

      var config = {
        params: data
      };

      $http.get("/api/statistics/orders/frequency", config).then(
        function(res) {
          $scope.data = res.data.orders;
          $scope.chartOptions.title.text = "Order Frequency by Hour";
          for (let index = 0; index < $scope.data.length; index++) {
            $scope.chartData.push($scope.data[index].total);
            $scope.chartLabels.push($scope.data[index]._id + ":00");
          }
        },
        function(res) {
          console.log(res);
        }
      );
    };

    $scope.getOrderDistribution = function() {
      var data = {
        data: undefined
      };

      var config = {
        params: data
      };

      $http.get("/api/statistics/orders/distribution", config).then(
        function(res) {
          $scope.data = res.data.orders;
          $scope.chartOptions.title.text = "Order Distribution by Drink";
          for (let index = 0; index < $scope.data.length; index++) {
            $scope.chartData.push($scope.data[index].total);
            $scope.chartLabels.push($scope.data[index]._id);
          }
        },
        function(res) {
          console.log(res);
        }
      );
    };

    $scope.getItemStock = function() {
      var data = {
        data: undefined
      };

      var config = {
        params: data
      };

      $http.get("/api/statistics/items/stock", config).then(
        function(res) {
          $scope.data = res.data.orders;
          $scope.chartOptions.title.text = "Stock by Drink";
          $scope.chartOptions.scales.yAxes[0].ticks.stepSize = 2;
          $scope.chartOptions.scales.yAxes[0].ticks.min = 0;

          for (let index = 0; index < $scope.data.length; index++) {
            $scope.chartData.push($scope.data[index].total);
            $scope.chartLabels.push($scope.data[index]._id);
          }
        },
        function(res) {
          console.log(res);
        }
      );
    };
  }
]);

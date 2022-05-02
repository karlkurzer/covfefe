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
    $scope.colors = {};
    $scope.colorsFrequency = [
      "#3E85E5",
      "#437FDB",
      "#4979D1",
      "#4E74C7",
      "#546EBD",
      "#5A68B3",
      "#5F63A9",
      "#655D9F",
      "#6A5895",
      "#70528B",
      "#764C81",
      "#7B4777",
      "#81416D",
      "#863C63",
      "#8C3659",
      "#92304F",
      "#972B45",
      "#9D253B",
      "#A22031",
      "#A81A27",
      "#AE141D",
      "#B30F13",
      "#B90909",
      "#BF0400"
    ];

    $scope.colorsStock = [
      "#3E85E5",
      "#576BB7",
      "#715189",
      "#8B375B",
      "#A51D2D",
      "#BF0400"
    ];

    $scope.colorsDistribution = [
      "#3E85E5",
      "#576BB7",
      "#715189",
      "#8B375B",
      "#A51D2D",
      "#BF0400"
    ];

    $scope.chartOptions = {
      title: {
        display: true,
        fontSize: 35
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontSize: 24,
              min: 0
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 24
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
        case "consumption":
          $scope.getOrderAverage();
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
          $scope.colors = $scope.colorsFrequency;
        },
        function(res) {
          console.log(res);
        }
      );
    };

    $scope.getOrderAverage = function() {
      var data = {
        data: undefined
      };

      var config = {
        params: data
      };

      $http.get("/api/statistics/orders/average", config).then(
        function(res) {
          $scope.data = res.data.orders;
          $scope.chartOptions.title.text = "Weekly Consumption by Drink";
          for (let index = 0; index < $scope.data.length; index++) {
            $scope.chartData.push($scope.data[index].total);
            $scope.chartLabels.push($scope.data[index]._id);
          }
          $scope.colors = $scope.colorsDistribution;
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
          $scope.colors = $scope.colorsDistribution;
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
          for (let index = 0; index < $scope.data.length; index++) {
            $scope.chartData.push($scope.data[index].total);
            $scope.chartLabels.push($scope.data[index]._id);
          }
          $scope.colors = $scope.colorsStock;
          $http.get("/api/statistics/orders/average", config).then(
            function(res) {
              $scope.items = res.data.orders;
              let min = 1000;
              $scope.items.forEach(item => {
                var stockItem = $scope.data.find(x => x._id === item._id);
                if (stockItem.total/item.total <= min) {
                  min = stockItem.total/item.total
                  $scope.buffer = { name: stockItem._id, weeks: stockItem.total/item.total };
                }
              });
            },
            function(res) {
              console.log(res);
            }
          );
        },
        function(res) {
          console.log(res);
        }
      );
    };
  }
]);

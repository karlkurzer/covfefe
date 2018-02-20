// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'statistics' controller
angular.module('statistics').controller('StatisticsController', ['$scope', 'Authentication', '$http', '$routeParams',
	function ($scope, Authentication, $http, $routeParams) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		$scope.chartData = [];
		$scope.chartLabels = [];
		$scope.chartSeries = [];
		// $scope.chartColors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

		$scope.chartOptions = {
			title: {
				display: true
			}
		};

		$scope.getData = function () {
			switch ($routeParams.query) {
				case 'distribution':
					$scope.getOrderDistribution();
					break;
				case 'frequency':
					$scope.getOrderFrequency();
					break;
				default:
					console.log("unknown query");
					break;
			}
		}

		$scope.getOrderFrequency = function () {
			var data = {
				data: undefined
			};

			var config = {
				params: data
			};

			// CHART FUNCTIONS
			$scope.chartDatasetOverride = [{
				label: "Bar chart",
				borderWidth: 10,
				type: 'bar',
				fillColor: "rgba(14,72,100,1)"
			}];

			$http.get('/api/statistics/orders/frequency', config).then(function (res) {
				$scope.data = res.data.orders;
				$scope.chartOptions.title.text = "Order Frequency by Hour";
				for (let index = 0; index < $scope.data.length; index++) {
					$scope.chartData.push($scope.data[index].total);
					$scope.chartLabels.push($scope.data[index]._id);
				}
			}, function (res) {
				console.log(res);
			});
		};

		$scope.getOrderDistribution = function () {
			var data = {
				data: undefined
			};

			var config = {
				params: data
			};

			// CHART FUNCTIONS
			$scope.chartDatasetOverride = [{
				label: "Pie chart",
				borderWidth: 10,
				type: 'pie',
				fillColor: "rgba(14,72,100,1)"
			}];

			$http.get('/api/statistics/orders/distribution', config).then(function (res) {
				$scope.data = res.data.orders;
				$scope.chartOptions.title.text = "Order Distribution by Drink";
				for (let index = 0; index < $scope.data.length; index++) {
					$scope.chartData.push($scope.data[index].total);
					$scope.chartLabels.push($scope.data[index]._id);
				}
			}, function (res) {
				console.log(res);
			});
		};
	}
]);
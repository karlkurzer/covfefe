// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'statistics' controller
angular.module('statistics').controller('StatisticsController', ['$scope', 'Authentication', '$http',
	function ($scope, Authentication, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		$scope.chartData = [];
		$scope.chartLabels = [];
		$scope.chartSeries = [];

		// CHART FUNCTIONS
		$scope.chartDatasetOverride = [{
			yAxisID: 'y-axis-1'
		}];
		$scope.chartOptions = {
			scales: {
				yAxes: [{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left'
				}]
			}
		};

		$scope.getOrderFrequency = function () {
			var data = {
				data: undefined
			};

			var config = {
				params: data
			};

			$http.get('/api/statistics/orders/frequency', config).then(function (res) {
				console.log(res);
			}, function (res) {
				console.log(res);
			});
		};
	}
]);
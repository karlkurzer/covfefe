// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('example').controller('ExampleController', ['$scope', '$http', '$timeout', 'Authentication',
	function($scope, $http, $timeout, Authentication) {
		// Expose the authentication service
		$scope.authentication = Authentication;
		$scope.news = [];

		$http({ method: 'GET', url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.blogger.com%2Ffeeds%2F746298260979647434%2Fposts%2Fdefault' }).
			then(function (response) {
				$scope.status = response.status;

				for (var i = 0; i < response.data.items.length; i++) {
					if (response.data.items[i].title && response.data.items[i].title.startsWith("Newsticker")) {
						$scope.data = response.data.items[i].description;
						$scope.data = response.data.items[i].description.split("++");

						for (var i = 0; i < $scope.data.length; i++) {
							if ($scope.data[i].startsWith("+ ")) {
								$scope.news.push("++" + $scope.data[i].trim() + " +++");
							}
						}
					}
				}
				$scope.currentNews = $scope.news[Math.floor(Math.random() * $scope.news.length)];
			}, function (response) {
				$scope.data = response.data || 'Request failed';
				$scope.status = response.status;
			});

		var newsTicker = function () {
			$scope.currentNews = $scope.news[Math.floor(Math.random() * $scope.news.length)];
			$timeout(newsTicker, 5000);
		}
		newsTicker();  

	}
]);

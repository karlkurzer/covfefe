// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('example').controller('ExampleController', ['$scope', '$http', '$timeout', '$interval', 'Authentication',
	function ($scope, $http, $timeout, $interval, Authentication) {
		// Expose the authentication service
		$scope.authentication = Authentication;
		$scope.news = [];

		var fetchNews = function () {
			$http({ method: 'GET', url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.blogger.com%2Ffeeds%2F746298260979647434%2Fposts%2Fdefault' }).
				then(function (response) {
					$scope.status = response.status;
					var newsId = 0;
					var newsHtml;
					// iterate over all the item
					console.log("fetched news...");
					for (var i = 0; i < response.data.items.length; i++) {
						// find the item with the title newsticker with the highest id
						if (response.data.items[i].title
							&& response.data.items[i].title.startsWith("Newsticker")
							&& newsId < response.data.items[i].title.match(/\d+/)) {
							newsId = response.data.items[i].title.match(/\d+/);
							newsHtml = response.data.items[i].description;
						}
					}
					// extract the news with a regex
					$scope.news = newsHtml.match(/\+\+\+.*?\+\+\+/g);
					$scope.currentNews = $scope.news.join(" ");
				}, function (response) {
					$scope.data = response.data || 'Request failed';
					$scope.status = response.status;
				})
		};

		fetchNews();
		$interval(fetchNews, 3600000);
	}
]);

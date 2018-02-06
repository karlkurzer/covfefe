// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'statistics' module routes
angular.module('statistics').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/statistics', {
			templateUrl: 'statistics/views/statistics.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]); 

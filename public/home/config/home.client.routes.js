// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'home' module routes
angular.module('home').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'home/views/home.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]); 

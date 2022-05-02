// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'users' module routes
angular.module('users').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/users', {
			templateUrl: 'users/views/list-users.client.view.html'
		}).
		when('/users/create', {
			templateUrl: 'users/views/create-user.client.view.html'
		}).
		when('/users/:userId', {
			templateUrl: 'users/views/view-user.client.view.html'
		}).
		when('/users/:userId/edit', {
			templateUrl: 'users/views/edit-user.client.view.html'
		});
	}
]); 
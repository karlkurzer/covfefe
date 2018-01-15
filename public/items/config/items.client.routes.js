// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'items' module routes
angular.module('items').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/items', {
			templateUrl: 'items/views/list-items.client.view.html'
		}).
		when('/items/create', {
			templateUrl: 'items/views/create-item.client.view.html'
		}).
		when('/items/:itemId', {
			templateUrl: 'items/views/view-item.client.view.html'
		}).
		when('/items/:itemId/edit', {
			templateUrl: 'items/views/edit-item.client.view.html'
		});
	}
]); 
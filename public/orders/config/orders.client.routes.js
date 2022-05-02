// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'orders' module routes
angular.module('orders').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/orders', {
			templateUrl: 'orders/views/list-orders.client.view.html'
		}).
		when('/orders/create', {
			templateUrl: 'orders/views/create-order.client.view.html'
		}).
		when('/orders/:orderId', {
			templateUrl: 'orders/views/view-order.client.view.html'
		}).
		when('/orders/:orderId/edit', {
			templateUrl: 'orders/views/edit-order.client.view.html'
		});
	}
]); 
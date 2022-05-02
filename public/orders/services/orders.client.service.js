// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'orders' service
angular.module('orders').factory('Orders', ['$resource', function($resource) {
	// Use the '$resource' service to return an order '$resource' object
    return $resource('api/orders/:orderId', {
        orderId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
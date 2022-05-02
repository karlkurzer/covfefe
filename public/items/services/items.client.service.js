// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'items' service
angular.module('items').factory('Items', ['$resource', function($resource) {
	// Use the '$resource' service to return an item '$resource' object
    return $resource('api/items/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
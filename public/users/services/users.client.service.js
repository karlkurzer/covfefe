// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' service
angular.module('users').factory('Users', ['$resource', function($resource) {
	// Use the '$resource' service to return an user '$resource' object
    return $resource('api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'CurrentOrder' service
angular.module('orders').factory('CurrentOrder', [
	function() {
		return { items:[], creator: {}, total: 0 } ;
	}
]);
// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'CurrentOrder' service
angular.module('orders').factory('CurrentOrder', [
	function() {
		return { items:[], creator: {}, total: 0, step: 0,
		reset: function () {
			this.items = [];
			this.creator = {};
			this.total = 0;
			this.balance = 0;
			this.step = 0;
		}} ;
	}
]);
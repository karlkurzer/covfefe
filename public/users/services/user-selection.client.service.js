// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'UserSelection' service
angular.module('users').factory('UserSelection', [
	function() {
		return { 
			userIndex: {},
			reset: function(){
				this.userIndex = -1;
				}
			};
	}
]);
// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'UserSelection' service
angular.module('users').factory('UserStats', [
	function() {
		return { 
			totalBalance: 0,
			reset: function(){
                this.totalBalance = 0;
				}
			};
	}
]);
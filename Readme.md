## covfefe
**covfefe** is a simple balance tracking tool for managing purchases of any items by users

### General Features
* sign-up/sign-in (sign-in is only required for admins)
* uses mongodb, express, angular and node

#### User Features
* create order
* edit order
* delete order
* list orders

#### Admin Features
* user updates (such as balance)
* user deletion

#### Run Instructions
run the following commands in the shell of your choice

* `npm install`
* `bower install`
* copy the environment config `development.js` in your config/env folder
* `node server.js`
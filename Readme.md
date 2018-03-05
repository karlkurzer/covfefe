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
* view user

#### Statistics Features

* stock
* order frequency
* order distribution

#### Admin Features

* user updates (such as balance)
* user deletion

#### Run Instructions

run the following commands in the shell of your choice

* `npm install`
* `bower install`
* copy the environment config `development.js` in your config/env folder
* `node server.js`

### Administer covfefe

#### Add Users

In order to add users to **covfefe** you have to follow the following steps.

1.  sign up @ [ids-services.fzi.de/signup](http://ids-services.fzi.de/signup)
2.  fill in the first and last name as well as the email address of the user
3.  the password cannot be blank at the moment, but does not have a function so just type `01234567`
4.  if successful you can click signout and you can now proceed with the next step and update the balance of the newly created user

#### Update Users

In order to update users you have to sign in with a user account that has admin privileges.

1.  sign in @ [ids-services.fzi.de/signin](http://ids-services.fzi.de/signin)
2.  filter for the name of the person you want to edit
3.  click the updated icon
4.  click the edit
5.  make the changes necessary and hit update

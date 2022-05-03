# covfefe

**covfefe** is a simple balance tracking tool for managing purchases of any items by users.

![image](https://user-images.githubusercontent.com/10877966/166305736-c4a6883b-b01f-490e-8d58-03e1763ae63f.png)


## Run Instructions
### Prerequisites

Adjust the [config](config/env/development.js) according to your needs. At least the following are required:

* domain: "domain.TLD" --> Regex to allow only users with email addresses ending in domain.TLD
* emailDomain: "^.+@domain.TLD$" --> Regex to allow only users with email addresses ending in domain.TLD
* emailSender: "covfefe@domain.TLD" --> Email address to send emails from

Search and replace the following according to your needs:

* domain.TLD --> Regex to allow only users with email addresses ending in domain.TLD
* covfefe.domain.TLD --> URL for the app

Build the docker image: 

`docker build -t covfefe .`
### Run
`docker-compose up`

### Creation of Admin User
1. [Add](#Add-Users) a new user to the database
2. Set the admin flag for the user to true (e.g., via mongo-express http://domain.TLD/8081)
3. [Update](#Update-Users) other users (e.g. their balance)
## Maintenance
The following commands should be run inside the `data` directory.
### Backup
`docker run -it --mount type=bind,source="$(pwd)"/covfefe,target=/covfefe --network covfefe_default --rm mongo mongodump --host covfefe_mongo_1 --username root --authenticationDatabase admin --password example --db=covfefe --out=.`

### Restore
`docker run -it  --mount type=bind,source="$(pwd)"/covfefe,target=/covfefe,readonly --network covfefe_default --rm mongo mongorestore --host covfefe_mongo_1 --username root --authenticationDatabase admin --password example --db=covfefe /covfefe`

## Administer covfefe

### Add Users

In order to add users to **covfefe**, you have to follow the following steps.

1.  sign up @ http://domain.TLD/signup
2.  fill in the first and last name as well as the email address of the user
3.  the password cannot be blank at the moment but does not have a function, so, e.g., just type `01234567`
4.  if successful, you can click signout, and you can now proceed with the next step and update the balance of the newly created user

### Update Users

In order to update users, you have to sign in with a user account that has admin privileges.

1.  sign in @ http://domain.TLD/signin
2.  filter for the name of the person you want to edit
3.  click the updated icon
4.  click the edit
5.  make the changes necessary and hit update

## General Features

* sign-up/sign-in (sign-in is only required for admins)
* uses mongodb, express, angular, and node

### User Features

* create order
* edit order
* delete order
* list orders
* view user

### Statistics Features

* stock
* order frequency
* order distribution

### Admin Features

* user updates (such as balance)
* user deletion

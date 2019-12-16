# Bux Influx Server and Database

Live app: [Bux Influx](https://glaiza-buxinflux-app.now.sh/)

# The API
This API was built using NodeJS, Express, and PostgresSQL. Most of the endpoints are protected with a JWT auth requirement.

# Endpoints
The following are the request endpoints for this server :::

Base URL = https://glaiza-buxinflux-server.herokuapp.com/api

# GET:
    /users/:uid/income -> protected endpoint. Returns all the user's income which matches the uid param. If there is no income for that uid, no record will be displayed.

    /users/:uid/expenses -> protected endpoint. Returns all the user's expenses that match the uid param. If there's no expenses for that uid, no record will be displayed.

# DELETE:
    /income/:iid -> protected endpoint. Will automatically delete the income that matches the iid param;

    /expenses/:eid -> protected endpoint. Will automatically delete the expenses that match the eid param

# POST:
    /users -> unprotected endpoint. Must send a fullname, username, password, and nickname(optional) in the request body. A new user will be created in the *users* table and the password will be hashed and protected. Errors will be sent back if the username has already been taken or the password doesn't meet the criteria:
        - Password must be between 8 and 72 characters
        - Password must contain 1 uppercase, lowercase, number and special characer
        - Password must not start or end with spaces

    /auth/login -> unprotected endpoint. Must send a username and password in the request body. This endpoint will check the username and password against the *users* table. If a correct username and password is supplied in the request body, JWT auth token will be send back from the API or error will be sent back that incorrect username or password if not supplied correctly.
# Bux Influx Server and Database

Live app: [Bux Influx](https://glaiza-buxinflux-app.now.sh/)

# The API
This API was built using NodeJS, Express, and PostgresSQL. Most of the endpoints are protected with a JWT auth requirement.

# Endpoints
The following are the request endpoints for this server :::

Base URL = https://glaiza-buxinflux-server.herokuapp.com/api

# GET:
    /users/:uid/income -> protected endpoint. Will return all the users income that matches the uid param;

    /users/:uid/expenses -> protected endpoint. Will return all the users expenses that matches the uid param

# DELETE:
    /income/:iid -> protected endpoint. Will delete the income that matches the iid param;

    /expenses/:eid -> protected endpoint. Will delete the expenses that matches the eid param

# POST:
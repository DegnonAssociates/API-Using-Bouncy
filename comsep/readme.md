# Degnon API Version 2.0

## Test Environment Settings

``` bash
NodeJS v8.11.1
npm v6.13.1
nodemon v2.0.1
```
## Installation

- Clone this repo
- run npm i

## Information

This API is the central server for all Degnon client routes. We use bouncy to handle incoming 
requests based on DNS and port number. Bouncy is configured in /index.js.

The following clients are set up 
- AMSPDC
- COMSEP

## Routes

Routes will be updated as they are added

``` bash
'/' - Hello world test
'/api/v2/neon/login' - authenticate against NEON API to obtain userSessionId (POST)
'/api/v2/neon/logout' - log out from NEON session to delete userSessionId (POST)
'/api/v2/neon/auth' - authenticate user credentials in NEON (separate from /login) (POST)

Accounts
'/api/v2/accounts/individual' - individual user accounts (GET, GET/:id, POST, POST/:id)

Degnon-specific routes
'/api/v2/degnon/journalClub' - access COMSEP journal club (COMSEP only --- GET, GET/:id)
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
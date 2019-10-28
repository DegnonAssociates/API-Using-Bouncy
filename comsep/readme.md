# Degnon API Version 2.0

## Test Environment Settings

``` bash
NodeJS v8.11.1
npm v5.6.0
nodemon v1.17.3 
```

## Routes

Routes will be updated as they are added

``` bash
'/' - Hello world test
'/api/v2/neon/login' - authenticate against NEON API to obtain userSessionId (POST)
'/api/v2/neon/logout' - log out from NEON session to delete userSessionId (POST)
'/api/v2/neon/auth' - authenticate user credentials in NEON (separate from /login) (POST)

Accounts
'/api/v2/accounts/individual' - individual user accounts (GET, GET/:id)
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
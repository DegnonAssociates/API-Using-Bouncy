# Degnon API using Bouncy package for reverse proxy

Attempted solution for using a singular IISnode instance

## Table of Contents

- [Installation](#installation)

## Usage

- Create two host entries in your OS/Server

```sh
127.0.0.1 localhost.test1
127.0.0.1 localhost.test2
```

- Run index.js in the main root folder. This will also start forked child processes for the two separate API applications located in ./amspdc and ./comsep

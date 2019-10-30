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

- Run index.js in the main root folder.
- Run a separate process on index.js for the ./amspdc and ./comsep root folders

const winston = require('winston');
const express = require('express');
const app     = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
// require('./startup/mongoDB')();
require('./startup/validation')();

app.set('view engine', 'pug');

const port = process.env.PORT || 3001;
const server = app.listen(port, () => winston.info(`AMSPDC Listening on port ${port}...`));

module.exports = server; 
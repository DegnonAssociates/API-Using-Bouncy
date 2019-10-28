const startupDebugger   = require('debug')('app:startup');
const dbDebugger        = require('debug')('app:db');
const winston           = require('winston');
const config            = require('config');

require('express-async-errors');

module.exports = function() {
	winston.add(winston.transports.File, { filename: 'logfile.log' });	

	winston.handleExceptions(
		new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
		new winston.transports.Console({ colorize: true, prettyPrint: true }));

	process.on('unhandledRejection', (ex) => {
		throw ex;
	});

	startupDebugger(`Application name: ${config.get('name')}`);


}
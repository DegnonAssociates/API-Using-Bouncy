const helmet       = require('helmet');
const compression  = require('compression');
const express      = require('express');
const errorHandler = require('../middleware/error');
const home         = require('../routes/home');
const neonLogin    = require('../routes/neon/login');
const neonLogout   = require('../routes/neon/logout');
const neonAuth     = require('../routes/neon/auth');
const neonIndividualAccounts = require('../routes/neon/accounts/individual');
const neonPasswordReset      = require('../routes/neon/accounts/reset');
const degnonJournalClub      = require('../routes/degnon/journalClub');


module.exports = function(app) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static('public'));
	app.use(helmet());
	app.use(compression());

	app.use('/', home);
	app.use('/api/v2/neon/login', neonLogin);
	app.use('/api/v2/neon/logout', neonLogout);
	app.use('/api/v2/neon/auth', neonAuth);
	app.use('/api/v2/neon/accounts/individual', neonIndividualAccounts);
	app.use('/api/v2/neon/accounts/reset', neonPasswordReset);
	
	app.use('/api/v2/degnon/journalclub', degnonJournalClub);
	app.use(errorHandler);
}


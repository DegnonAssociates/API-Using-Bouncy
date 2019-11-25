const fetch    = require('node-fetch');
const Joi      = require('joi');
const config   = require('config');
const auth     = require('../../../middleware/neon/auth');
const validate = require('../../../middleware/validate');
const express  = require('express');
const router   = express.Router();


// POST password reset
router.post('/', [auth, validate(validateReset)], async (req,res) => {
	const resetUri = config.get('neonUri') + '/account/updateIndividualAccount';
    const resetSessionId = req.body.sessionId;
    const resetUsername = req.body.username;
    const resetPassword = req.body.password;

	const getUrl = `${resetUri}?reset.apiKey=${resetSessionId}&individualAccount.login.username=${resetUsername}&individualAccount.login.password=${resetPassword}`;

	const request = await fetch(getUrl);
	const response = await request.json();	
	
	if (response.resetResponse.operationResult === 'FAIL') 
		return res.status(400).send('Password Reset Failed');
	
	res.send(response.resetResponse.userSessionId);	
});

function validateReset(req) {
	const schema = {
		sessionId: Joi.string().min(32).max(255).required(),
        username: Joi.string().min(3).max(100).required(),
        password: Joi.string().min(3).max(255).required()
	};

	return Joi.validate(req, schema);
};

module.exports = router;
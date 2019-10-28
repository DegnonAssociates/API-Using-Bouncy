const _        = require('lodash');
const fetch    = require('node-fetch');
const config   = require('config');
const Joi      = require('joi');
const validate = require('../../middleware/validate');
const express  = require('express');
const router   = express.Router();

// POST user
router.post('/', validate(validateSession), async (req,res) => {
	const logoutUri = config.get('neonUri') + '/common/logout';
	const sessionId = req.body.sessionId;
	const getUrl = `${logoutUri}?userSessionId=${sessionId}`;

	const request = await fetch(getUrl);
	const response = await request.json();	
	
	if (response.logoutResponse.operationResult === 'FAIL') {
		const error = response.logoutResponse.errors.error[0].errorMessage;
		return res.status(400).send(error);
	}
	
	res.send(response.logoutResponse.responseMessage);	
});

function validateSession(req) {
	const schema = {
		sessionId: Joi.string().min(32).max(32).required()
	};

	return Joi.validate(req, schema);
};

module.exports = router;
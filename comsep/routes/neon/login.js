const _        = require('lodash');
const fetch    = require('node-fetch');
const Joi      = require('joi');
const config   = require('config');
const validate = require('../../middleware/validate');
const express  = require('express');
const router   = express.Router();

// POST user
router.post('/', validate(validateAuth), async (req,res) => {
	const loginUri = config.get('neonUri') + '/common/login';
	const loginApiKey = req.body.apiKey;
	const loginOrgId = config.get('comsepNeonOrganizationId');
	const getUrl = `${loginUri}?login.apiKey=${loginApiKey}&login.orgid=${loginOrgId}`;

	const request = await fetch(getUrl);
	const response = await request.json();	
	
	if (response.loginResponse.operationResult === 'FAIL') 
		return res.status(400).send('NEON Authorization Failed');
	
	res.send(response.loginResponse.userSessionId);	
});

function validateAuth(req) {
	const schema = {
		apiKey: Joi.string().min(32).max(32).required()
	};

	return Joi.validate(req, schema);
};

module.exports = router;
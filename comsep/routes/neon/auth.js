const fetch    = require('node-fetch');
const Joi      = require('joi');
const config   = require('config');
const jwt      = require('jsonwebtoken');
const auth     = require('../../middleware/neon/auth');
const validate = require('../../middleware/validate');
const express  = require('express');
const winston  = require('winston');
const router   = express.Router();

// POST user
router.post('/', [auth, validate(validateAuth)], async (req,res) => {
	const loginUri = config.get('neonUri') + '/common/authenticateUser';
	const username = req.body.username;
	const password = req.body.password;
	const getUrl = `${loginUri}?username=${username}&password=${password}&userSessionId=${req.token}`;

	const request = await fetch(getUrl);
	const response = await request.json();	
	
	if (response.authenticateUserResponse.operationResult === 'FAIL') 
		return res.status(400).send('Invalid username/password');
	
	const payload = encodePayload(response.authenticateUserResponse);
	// winston.info(`authResponse is ${payload}`);
	res.send(payload);	
});

function encodePayload(data) {
	return jwt.sign( data, config.jwtPrivateKey );
}

function validateAuth(req) {
	const schema = {
		username: Joi.string().min(3).max(255).required(),
		password: Joi.string().min(3).max(1024).required()
	};

	return Joi.validate(req, schema);
};

module.exports = router;
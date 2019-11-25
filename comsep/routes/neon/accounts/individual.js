const fetch    = require('node-fetch');
const config   = require('config');
const Joi      = require('joi');
const auth     = require('../../../middleware/neon/auth');
const validate = require('../../../middleware/validate');
const express  = require('express');
const customFields = require('../../../middleware/neon/neon-custom-fields');
const buildUpdateString = require('../../../middleware/neon/build-neon-account-update-string.js');
const router   = express.Router();

const accountUri = config.get('neonUri') + '/account';

// GET all accounts
router.get('/', auth, async (req,res) => {
	let response;
	const page = req.query.page || 1;
	const getUrl = `${accountUri}/listAccountsByDefault?userSessionId=${req.token}&page.currentPage=${page}`;

	const request = await fetch(getUrl);
	try {
		response = await request.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
	}
	if(response.listAccountsByDefaultResponse.operationResult === 'FAIL')
		return res.status(400).send('Bad Request: Invalid token');
			
	res.send(response.listAccountsByDefaultResponse);
});

// GET one account
router.get('/:id', auth, async (req,res) => {
	let response;
	const getUrl = `${accountUri}/retrieveIndividualAccount?userSessionId=${req.token}&accountId=${req.params.id}`;

	const request = await fetch(getUrl);
	try {
		response = await request.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
	}
	if(response.retrieveIndividualAccountResponse.operationResult === 'FAIL')
		return res.status(400).send('Bad Request: Invalid token');
			
	res.send(response.retrieveIndividualAccountResponse);
});

// POST new account
router.post('/', [auth, customFields, validate(validateNewAccount)], async (req,res) => {
	const legacyIdField = getCustomField(req, "Legacy ID");

	// Neon requires account first/last name. We require our SQL
	// member id to be included in the legacy ID Neon custom field
	let createAccountUri = `${accountUri}/createIndividualAccount?userSessionId=${req.token}&individualAccount.primaryContact.firstName=${req.body.firstName}&individualAccount.primaryContact.lastName=${req.body.lastName}&individualAccount.customFieldDataList.customFieldData.fieldId=${legacyIdField.fieldId}&individualAccount.customFieldDataList.customFieldData.fieldOptionId=&individualAccount.customFieldDataList.customFieldData.fieldValue=${req.body.memberId}`;

	const postRequest = await fetch(createAccountUri);
	try {
		postResponse = await postRequest.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
	}	
	if(postResponse.createIndividualAccountResponse.operationResult === 'FAIL')
		return res.status(400).send('New Account Error: ' + postResponse.createIndividualAccountResponse.errors.error[0].errorMessage);
			
	res.send(postResponse.createIndividualAccountResponse.operationResult);
});

// POST account update
router.post('/:id', [auth, customFields], async (req,res) => {
	// Have to get individual account id
	let getResponse;
	const getUrl = `${accountUri}/retrieveIndividualAccount?userSessionId=${req.token}&accountId=${req.params.id}`;
	const getRequest = await fetch(getUrl);
	try {
		getResponse = await getRequest.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
	}
	if(getResponse.retrieveIndividualAccountResponse.operationResult === 'FAIL')
		return res.status(400).send('Bad Request: Invalid token');

	// Neon requires the following 3 URL query params in addition to the 
	// account ID and API session ID in order to do any updates to their data
	const accountId = req.params.id;
	const contactId = getResponse.retrieveIndividualAccountResponse.individualAccount.primaryContact.contactId;
	const contactFirstName = getResponse.retrieveIndividualAccountResponse.individualAccount.primaryContact.firstName;
	const contactLastName = getResponse.retrieveIndividualAccountResponse.individualAccount.primaryContact.lastName;

	// build update string
	const updateString = await buildUpdateString(accountUri, accountId, contactId, contactFirstName, contactLastName, req.body, req.token);

	// now update the record
	let postResponse;
	let postUrl = updateString;

	const postRequest = await fetch(postUrl);
	try {
		postResponse = await postRequest.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
	}	
	if(postResponse.updateIndividualAccountResponse.operationResult === 'FAIL')
		return res.status(400).send('Update Error: ' + postResponse.updateIndividualAccountResponse.errors.error[0].errorMessage);
			
	res.send(postResponse.updateIndividualAccountResponse.operationResult);
});

function validateNewAccount(req) {
	const schema = {
		firstName: Joi.string().min(3).max(255).required(),
		lastName: Joi.string().min(3).max(255).required(),
		memberId: Joi.number().integer().required()
	};

	return Joi.validate(req, schema);
};

function getCustomField(req, q) {
	let response;
	const criteria = String(q);

	for( i=0; i<req.customFields.length; i++){
		for(key in req.customFields[i]) {
			if(key === 'fieldName'){
				if(req.customFields[i][key].indexOf(criteria)!=-1) {
					response = req.customFields[i];
					return response;
				}
			}			
		}
	}
	return null;

}

module.exports = router;
const fetch    = require('node-fetch');
const config   = require('config');


const accountUri = config.get('neonUri') + '/common';

module.exports = async function(req, res, next){
    let response;
    const getUrl = `${accountUri}/listCustomFields?userSessionId=${req.token}&searchCriteria.component=Account`;
    
    const request = await fetch(getUrl);
	try {
		response = await request.json();	
	}
	catch (ex) {
		return res.status(400).send('Bad Request');
    }
    if(response.listCustomFieldsResponse.operationResult === 'FAIL')
		return res.status(400).send('Bad Request: Invalid token');
    
    req.customFields = response.listCustomFieldsResponse.customFields.customField;
    next();
}
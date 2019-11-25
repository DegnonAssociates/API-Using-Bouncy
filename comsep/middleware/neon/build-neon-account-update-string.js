// there's still a lot to add here. Field references can be found at
// https://developer.neoncrm.com/api/accounts/update-individual-account/


module.exports = async function(accountUri, accountId, contactId, fName, lName, data, token){
    let queryString = `${accountUri}/updateIndividualAccount?userSessionId=${token}&individualAccount.accountId=${accountId}&individualAccount.primaryContact.contactId=${contactId}`;

    if(data.firstName){
        queryString += `&individualAccount.primaryContact.firstName=${data.firstName}`;
    } else {
        queryString += `&individualAccount.primaryContact.firstName=${fName}`;
    }

    if(data.lastName){
        queryString += `&individualAccount.primaryContact.lastName=${data.lastName}`;
    } else {
        queryString += `&individualAccount.primaryContact.lastName=${lName}`;
    }

    if(data.middleName){
        queryString += `&individualAccount.primaryContact.middleName=${data.middleName}`;
    }

    if(data.email){
        queryString += `&individualAccount.primaryContact.email1=${data.email}`;
    }

    return queryString;
    
}
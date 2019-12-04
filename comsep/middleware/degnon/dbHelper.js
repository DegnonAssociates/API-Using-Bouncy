const db = require ("./db.js");

exports.getCount = function (table) {
    const cSql = "SELECT count(*) as numRows FROM " + table;

	return new Promise(function(resolve, reject) {
		db.executeSql(cSql, function(results, err) {
			if (err){
				reject(err);
			} else {
				resolve(results.recordset[0].numRows);
			}
			
		});
	});
}
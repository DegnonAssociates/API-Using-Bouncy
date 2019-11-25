const sqlDb = require ("mssql");
const config   = require('config');



exports.executeSql = function (sql, callback) { 
	const conn = new sqlDb.ConnectionPool(config.dbConfig);

	conn.connect()
	.then(function () { 
        const req = new sqlDb.Request(conn);
		req.query(sql)
		.then(function (recordset) { 
			callback(recordset);
		})
		.catch(function (err) { 
			console.log("QUERY ERROR: " + err);
			callback(null, err);
		});
	})
	.catch(function (err) { 
		callback(null, err);
	});
};
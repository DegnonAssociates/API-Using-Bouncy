const db        = require("../../middleware/degnon/db");
const dbHelper  = require("../../middleware/degnon/dbHelper");
const config    = require('config');
const express   = require('express');
const router    = express.Router();


router.get('/', async (req,res) => {
    try {
        const numRows = await dbHelper.getCount("journal_club");
        // page number passed in URL query string
        const page = parseInt(req.query.page, 10) || 1;  
        // items per page
        const numPerPage  = parseInt(config.defaultSearchLimit); 
        // start row
        const offset = (page - 1) * numPerPage;          
        // max pages available     	    
        const numPages = Math.ceil(numRows / numPerPage) 
        let err;

        if (page > numPages) {
            err = ("Page " + page + " exceeds available limit of " + numPages + " pages");
            return res.status(500).send("An error has occurred: " + err);
        } 
            
        let sql = "SELECT id, title, body, orderid, absyear, postMonth, archived FROM [Journal_Club] WHERE 1=1 ";
        const q = req.query.q || '';
        const archived = req.query.archived || '';
        const jYear = req.query.jYear || '';
        const jMonth = req.query.month || '';

        // Generic search query
        if(q){
            sql += "AND ( title like '%" + q + "%' OR body like '%" + q + "%' ) ";
        }

        // search if archived defined
        if(archived){
            sql += "AND archived = " + archived + " ";
        }

        // search if year defined
        if(jYear){
            sql += "AND absYear = " + jYear + " ";
        }

        // search if month defined
        if(jMonth){
            sql += "AND postMonth = " + jMonth + " ";
        }

        sql += " ORDER BY absyear desc, type desc, orderid OFFSET " + offset + " ROWS FETCH NEXT " + numPerPage + " ROWS ONLY";

        db.executeSql(sql, function(data, err) {
			if (err){
				return res.status(500).send("An error has occurred: " + err);
			} else {
				res.send(data.recordsets[0][0]);
			}
			
		});
    }
    catch (ex) {
        return res.status(500).send("An error has occurred: " + ex);
    }
});

router.get('/:id', async (req,res) => {
    const sql = "SELECT id, title, body, orderid, absyear, postMonth, archived FROM [Journal_Club] WHERE id = " + req.params.id;
	
	db.executeSql(sql, function(data, err) {
		if(err){
			return res.status(500).send("An error has occurred: " + err);
		} else {
			res.send(data);
		}
	});
});
module.exports = router;
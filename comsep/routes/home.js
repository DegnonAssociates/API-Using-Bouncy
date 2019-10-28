const express = require('express');
const router  = express.Router();


// GET root
router.get('/', (req,res) => {
	res.render('index', { title: 'COMSEP API', message: 'Home page for COMSEP API' });
});

module.exports = router;
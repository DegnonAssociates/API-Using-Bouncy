const express = require('express');
const router  = express.Router();


// GET root
router.get('/', (req,res) => {
	res.render('index', { title: 'AMSPDC API', message: 'Home page for AMSDPC API' });
});

module.exports = router;
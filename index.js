const bouncy = require('bouncy');

require('./amspdc').fork;
require('./comsep').fork;

const server = bouncy(function (req, res, bounce) {
    if (req.headers.host === 'localhost.test1') {
        bounce(3001);
    }
    else if (req.headers.host === 'localhost.test2') {
        bounce(3002);
    }
    else {
        res.statusCode = 404;
        res.end('no such host');
    }
});

server.listen(80);
console.log('Listening on 80');
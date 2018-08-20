var express = require('express');
var router = express.Router();

var jsforce = require('jsforce');
var conn = new jsforce.Connection({
               loginUrl : process.env.loginURL || 'https://login.salesforce.com'
});


router.get('/', function(req, res1) {
	conn.login(process.env.admin_username, process.env.admin_password, function(err, res2) {
		if (err) { return console.log(err); }

		// querying the Flosum package Id
		conn.query('SELECT Id,isActive, Name FROM User where companyName = \'Deloitte\' and  username != \'' + process.env.admin_username + '\' order by name', function(err, res3) {
			if (err) { return console.error(err); }
			if(res3.records.length){
				res1.json(res3.records);
			}
		});
	});
});

module.exports = router;
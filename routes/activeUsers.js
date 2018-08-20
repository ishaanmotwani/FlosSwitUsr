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
		conn.query('SELECT Id,NamespacePrefix FROM PackageLicense where NamespacePrefix = \'Flosum\'', function(err, res3) {
			if (err) { return console.error(err); }
			if(res3.records.length){
				var packageId = res3.records[0].Id;
				//console.log(packageId);
				// query the userpackageLicense
				conn.query('Select id,userid from UserPackageLicense where PackageLicenseId = \'' + packageId+ '\'', function(err, res4) {
					if (err) { return console.error(err); }
					//console.log(res4);
					if(res4.records.length){
						var i;
						var query = 'Select id,Name from User where companyName = \'Deloitte\' and isActive = true and  id in (\'';
						for (i = 0; i < res4.records.length; i++) { 
							if(i<(res4.records.length-1)){
								query = query + res4.records[i].UserId + '\',\'';
							}
							else{
								query = query + res4.records[i].UserId + '\')';
							}
						}
						query = query + ' order by name';
						//console.log(query);
						conn.query(query , function(err, res5) {
							if (err) { return console.error(err); }
							//console.log(res5);
							if(res5.records.length){
								res1.json(res5.records);
							}
						});
					}
				});				
			}
		});
	});
});

module.exports = router;
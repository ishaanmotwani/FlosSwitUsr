var express = require('express');
var router = express.Router();

var jsforce = require('jsforce');
var conn = new jsforce.Connection({
               loginUrl : 'https://login.salesforce.com'
});

router.post('/', function(req, res1){
	//console.log(req);
	conn.login('sonal.deshmukh@gilead.com', 'Gilead2_', function(err, res2) {
		if (err) { return console.log(err); }

		// deactivate the user
		conn.sobject("User").update({ Id : req.body.selectedActiveUser.Id,isActive : false}, function(err, res) {
			if (err || !res.success) { return console.error(err, res); }
			if(res.success){
				console.log('Deactivated '+ req.body.selectedActiveUser.Name + ' successfully ');
				// querying the Flosum package Id
				conn.query('SELECT Id,NamespacePrefix FROM PackageLicense where NamespacePrefix = \'Flosum\'', function(err, res3) {
					if (err) { return console.error(err); }
					if(res3.records.length){
						var UserPackageLicenseId;
						var packageId = res3.records[0].Id;
						//console.log(packageId);
						// query the userpackageLicense
						conn.query('Select id,userid from UserPackageLicense where userid = \'' + req.body.selectedActiveUser.Id + '\' and PackageLicenseId = \'' + packageId+ '\'', function(err, res4) {
							if (err) { return console.error(err); }
							//console.log(res4);
							if(res4.records.length){
								UserPackageLicenseId = res4.records[0].Id;                                                                                                                              
								// deleting the UserPackageLicense record
								conn.sobject("UserPackageLicense").destroy(UserPackageLicenseId, function(err, ret) {
											if (err || !ret.success) { return console.error(err, ret); }
											console.log('Deleted UserPackageLicense record successfully for : ' + req.body.selectedActiveUser.Name);
								});
							}
							else{
								 console.log(req.body.selectedActiveUser.Name + ' does not have Flosum License Assigned, hence skipping its removal');
							}
						});
						
						// activating the user
						conn.sobject("User").update({ Id : req.body.selectedInactiveUser.Id,isActive : true}, function(err, ret) {
							if (err || !ret.success) { return console.error(err, ret); }
							console.log('Activated '+ req.body.selectedInactiveUser.Name + ' successfully ');

							// creating the UserPackageLicense record
							if(ret.success && UserPackageLicenseId != undefined){
								conn.sobject("UserPackageLicense").create({ PackageLicenseId : packageId, userId : req.body.selectedInactiveUser.Id}, function(err, ret) {
									if (err || !ret.success) { return console.error(err, ret); }
									console.log('Created UserPackageLicense record successfully for : ' + req.body.selectedInactiveUser.Name);
									console.log(ret);
									res1.json(ret);
								});
							}
						});           
					}
				});
			}
		});
	}); 
});


module.exports = router;
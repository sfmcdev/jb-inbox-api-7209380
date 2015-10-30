'use strict';
var https = require( 'https' );
var http = require( 'http' );
var activityUtils = require('./activityUtils');


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );

	//initCase(req,res);
	initInboxMsg(req,res);
};

function initInboxMsg(req, res)
{
	//merge the array of objects for easy access in code.
	var aArgs = req.body.inArguments;
	console.log( aArgs );
	var oArgs = {};
	var iLen = 0;
	if(aArgs != undefined)
	{
		iLen = aArgs.length;
	}
	for (var i=0; i<iLen; i++) {  
		for (var key in aArgs[i]) { 
			oArgs[key] = aArgs[i][key]; 
		}
	}
	
	
	var contactKey = req.body.keyValue;

	// these values come from the config.json
	
	
	// TODO - remove test data
	if(!contactKey)
	{
		oArgs = {
			"titleEn": "EN Test Title",
			"contentEn": "EN Test Content",
			"titleTc": "TC  Test Title",
			"contentTc": "TC Test Content",
			"messageType" : "MEMBER",
			"relatiedId" : "150"
		};
		contactKey = "927746965857";
	}
	
	// these values come from the custom activity form inputs
	var titleEn = oArgs.titleEn;
	var contentEn = oArgs.contentEn;
	var titleTc = oArgs.titleTc;
	var contentTc = oArgs.contentTc;
	var relatedId = oArgs.relatedId;
	var messageType = oArgs.messageType;
	var apiUrl = oArgs.apiUrl;
	
	var post_url = 'http://uat.gtomato.com/pizzahut/internalApi/createMessage.do'
	// TODO - add PROD url
	if(apiUrl == "PROD")
	{
		
	}
	
	// any logic for bonus allocation can go here...
	// This is a placeholder that shows an example https call
	// to a given endpoint.  Again, you can do anything you like here.
	
	console.log('INBOX message for ', contactKey);
	var form_data = {  
		"userId":contactKey,
		"titleEn": titleEn,
		"contentEn": contentEn,
		"titleTc": titleTc,
		"contentTc": contentTc,
		"type":messageType,
		"relatedId": relatedId,
		"isPush": false
	};
		
	console.log('form data:', form_data);

	var request = require('request');

	request.post(
		'http://uat.gtomato.com/pizzahut/internalApi/createMessage.do',
		{ 
			form: form_data
		},
		function (error, response, body) 
		{
			if (!error && response.statusCode == 200) {				
				console.log('onEND inbox Create:', response.statusCode, data);
				res.send( 200, {"status": 0} );
			} else {
				console.log('onEND fail:', response.statusCode);
				res.send(response.statusCode);
			}		
		}
	);
	
	/*
	var httpsCall = http.request(options, function(response) {
		var data = '';
		var error = '';
			
		response.on( 'data' , function( chunk ) {
			data += chunk;
		});

		response.on( 'end' , function() {
			console.log("data:",data);

			if (response.statusCode == 200) {
				data = JSON.parse(data);
				console.log('onEND allocateOffer:', response.statusCode, data);
				res.send( 200, {"status": 0} );
			} else {
				console.log('onEND fail:', response.statusCode);
				res.send(response.statusCode);
			}		
		});								
	});

	httpsCall.on( 'error', function( e ) {
		console.error(e);
		res.send(500, 'initInboxMsg', {}, { error: e });
	});				
	
	httpsCall.write(form_data);
	httpsCall.end();
	*/
}


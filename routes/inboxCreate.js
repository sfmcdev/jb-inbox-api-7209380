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
	

	// these values come from the custom activity form inputs
	var relatedId = oArgs.relatedId;
	var messageType = oArgs.messageType;
	var apiUrl = oArgs.apiUrl;
	
	var titleEn = oArgs.titleEn;
	var contentEn = oArgs.contentEn;
	var titleTc = oArgs.titleTc;
	var contentTc = oArgs.contentTc;
	// push args
	var isPush = oArgs.isPush;	
	var pushTitleEn = oArgs.pushTitleEn;
	var pushContentEn = oArgs.pushContentEn;
	var pushTitleTc = oArgs.pushTitleTc;
	var pushContentTc = oArgs.pushContentTc;
	
	var valid = true;
	if(isPush &&
		(
			!pushTitleEn || pushTitleEn == undefined
			|| !pushTitleTc || pushTitleTc == undefined
			|| !pushContentEn || pushContentEn == undefined
			|| !pushContentTc || pushContentTc == undefined
		)
	)
	{
		valid = false;
	}
		
    activityUtils.logData( req );
	if(valid)
	{
		res.send( 200, 'Validate' );
	}
	else
	{
		res.send( 500, 'Validate' );
	}
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
			"titleTc": "Test 中文標題",
			"contentTc": "Push 中文肉容",
			"messageType" : "MEMBER",
			"relatedId" : "",
			"isPush" : true,
			"pushTitleEn": "Push EN Title",
			"pushContentEn": "Push EN Content",
			"pushTitleTc": "Push 中文標題",
			"pushContentTc": "Push 中文肉容"
		};
		contactKey = "927746965857";
	}
	
	// these values come from the custom activity form inputs
	var relatedId = oArgs.relatedId;
	var messageType = oArgs.messageType;
	var apiUrl = oArgs.apiUrl;
	
	var titleEn = oArgs.titleEn;
	var contentEn = oArgs.contentEn;
	var titleTc = oArgs.titleTc;
	var contentTc = oArgs.contentTc;
	// push args
	var isPush = oArgs.isPush;	
	var pushTitleEn = oArgs.pushTitleEn;
	var pushContentEn = oArgs.pushContentEn;
	var pushTitleTc = oArgs.pushTitleTc;
	var pushContentTc = oArgs.pushContentTc;
	
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
		"type":messageType,
		"relatedId": relatedId,
		"titleEn": titleEn,
		"contentEn": contentEn,
		"titleTc": titleTc,
		"contentTc": contentTc,		
		"isPush": isPush,
		"pushTitleEn": pushTitleEn,
		"pushContentEn": pushContentEn,
		"pushTitleTc": pushTitleTc,
		"pushContentTc": pushContentTc
	};
		
	console.log('form data:', form_data);
	console.log('url:', post_url);

	var request = require('request');
	request.post(
		post_url, 
		{ 
			form: form_data
		},
		function (error, response, body) 
		{
			if (!error && response.statusCode == 200) {				
				console.log('onEND inbox Create:', response.statusCode);
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


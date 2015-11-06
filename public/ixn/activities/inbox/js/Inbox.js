define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1; 
	var tokens;
	var endpoints;
	
    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var apiUrl;
		var relatedId;
		var titleEn;
		var contentEn;
		var titleTc;
		var contentTc;
		var messageType;
		var isPush;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);
            
			//merge the array of objects.
			var aArgs = toJbPayload['arguments'].execute.inArguments;
			var oArgs = {};
			for (var i=0; i<aArgs.length; i++) {  
				for (var key in aArgs[i]) { 
					oArgs[key] = aArgs[i][key]; 
				}
			}
			//oArgs.priority will contain a value if this activity has already been configured:
			apiUrl = oArgs.apiUrl || toJbPayload['configurationArguments'].defaults.apiUrl;
			relatedId = oArgs.relatedId || toJbPayload['configurationArguments'].defaults.relatedId;
			titleEn = oArgs.titleEn || toJbPayload['configurationArguments'].defaults.titleEn;
			contentEn = oArgs.contentEn || toJbPayload['configurationArguments'].defaults.contentEn;
			titleTc = oArgs.titleTc || toJbPayload['configurationArguments'].defaults.titleTc;
			contentTc = oArgs.contentTc || toJbPayload['configurationArguments'].defaults.contentTc;
			messageType = oArgs.messageType || toJbPayload['configurationArguments'].defaults.messageType;
			isPush = oArgs.isPush || toJbPayload['configurationArguments'].defaults.isPush;
        }
        
		$.get( "/version", function( data ) {
			$('#version').html('Version: ' + data.version);
		});                

		$('#titleEn').val(titleEn);
		$('#relatedId').val(relatedId);
		$('#titleTc').val(titleTc);
		$('#contentEn').val(contentEn);
		$('#contentTc').val(contentTc);
		$('#selectMessageType').find('option[value='+ messageType +']').attr('selected', 'selected');		
		$('#selectURLType').find('option[value='+ apiUrl +']').attr('selected', 'selected');		
		$('#isPush').attr('checked', isPush);
		
		connection.trigger('updateButton', { button: 'next', enabled: false });
		gotoStep(step);
        
    });

    connection.on('requestedTokens', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
		}        
    });

    connection.on('requestedEndpoints', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
		}        
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');
		connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                connection.trigger('updateButton', { button: 'back', visible: false });
				
				connection.trigger( 'updateStep', step ); 
            break;
			default:
                save();
            break;
        }
    };

	function getApiUrl()
	{
		return $('#selectURLType').find('option:selected').attr('value').trim();
	};
	
	function getRelatedId()
	{
		var str = $('#relatedId').val();
		if(str)
			return str.trim();
		return "";
	}
	
    function getTitleEn()
	{
		var str = $('#titleEn').val();
		if(str)
			return str.trim();
		return "";
	};
	
	function getContentEn()
	{
		var str = $('#contentEn').val();
		if(str)
			return str.trim();
		return "";
	};
	
	
	function getTitleTc()
	{
		var str = $('#titleTc').val();
		if(str)
			return str.trim();
		return "";
	};
	
	function getContentTc()
	{
		var str = $('#contentTc').val();
		if(str)
			return str.trim();
		return "";
	};
    function getMessageType() {
        return $('#selectMessageType').find('option:selected').attr('value').trim();
    };
	
	function getIsPush()
	{
		return $('#isPush').is(":checked");
	}

    function save() {
		var apiUrl = getApiUrl();
		var relatedId = getRelatedId();
        var titleEn = getTitleEn();
		var contentEn = getContentEn();
		var titleTc = getTitleTc();
		var contentTc = getContentTc();
		var messageType = getMessageType();
		var isPush = getIsPush();
		
        toJbPayload['arguments'].execute.inArguments.push({"apiUrl": apiUrl});
        toJbPayload['arguments'].execute.inArguments.push({"relatedId": relatedId});
        toJbPayload['arguments'].execute.inArguments.push({"titleEn": titleEn});
		toJbPayload['arguments'].execute.inArguments.push({"contentEn": contentEn});
		toJbPayload['arguments'].execute.inArguments.push({"titleTc": titleTc});
		toJbPayload['arguments'].execute.inArguments.push({"contentTc": contentTc});
		toJbPayload['arguments'].execute.inArguments.push({"messageType": messageType});
		toJbPayload['isPush'].execute.inArguments.push({"isPush": messageType});
		
		toJbPayload['configurationArguments'].apiUrl = apiUrl;
		toJbPayload['configurationArguments'].relatedId = relatedId;
		toJbPayload['configurationArguments'].titleEn = titleEn;
		toJbPayload['configurationArguments'].titleTc = titleTc;
		toJbPayload['configurationArguments'].contentEn = contentEn;
		toJbPayload['configurationArguments'].contentTc = contentTc;
		toJbPayload['configurationArguments'].messageType = messageType;
		toJbPayload['configurationArguments'].isPush = isPush;
		
		toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured.
        connection.trigger('updateActivity', toJbPayload);
    }; 
    	 
});
			

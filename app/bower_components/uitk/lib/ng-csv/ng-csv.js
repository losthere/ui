/*
 *** DO NOT MODIFY THE COPYRIGHT HEADER MANUALLY ***
 *** Release process will update accordingly ***
 * Copyright (c) Optum 2015 - All Rights Reserved.
 * @version 3.6.0
 *
 * https://github.com/asafdav/ng-csv
 * MIT License | Copyright (c) 2015 Object Computing, Inc.
 */
 angular.module('uitk.component.ngCsv', [])

 .factory('uitkDynamicTableExporter', function() {

 	var specialChars = {
       '\\t': '\t',
       '\\b': '\b',
       '\\v': '\v',
       '\\f': '\f',
       '\\r': '\r'
 	};

 	/**
      * Helper function to check if input is really a special character
      * Author: asafdav - https://github.com/asafdav
      * @param input
      * @returns {boolean}
      */
     function isSpecialChar(input) {
       return specialChars[input] !== undefined;
     };

     /**
      * Helper function to get what the special character was supposed to be
      * since Angular escapes the first backslash
      * Author: asafdav - https://github.com/asafdav
      * @param input
      * @returns {special character string}
      */
     function getSpecialChar(input) {
       return specialChars[input];
     };


 	return function (table, fileName) {
 		fileName = (fileName || "export")  + ".csv";
 		['*[class^="cux-icon-"]', '.oui-a11y-hidden','input', 'select', 'textarea', 'button', 'img'].forEach(function(selector){
 			table.find(selector).remove();
 		});

 		var cellArray = [];
 		var rowArray = [];
 		var headerArray = [];
 		var cellText = '';

    // ===================================================
 		// Parse table headers
 		function constructHeader(lastHeader){
 			if(lastHeader !== '&nbsp;') {
 				// replaces any badly formatted special character string with correct special character
 				lastHeader = isSpecialChar(lastHeader) ? getSpecialChar(lastHeader) : lastHeader;
 				// surrounding headers with double quotes
 				lastHeader = '"' + lastHeader + '"';
 				headerArray.push(lastHeader);
 			}
 		}
 		
 		var tableHeaders = table.find('th');
 		for ( var i = 0; i < tableHeaders.length; i++ ) {
 			var textHeader = $(tableHeaders[i]).find('a span').html();
 	
 			if (typeof textHeader !== 'undefined') {
 				// replaces any badly formatted special character string with correct special character
 				textHeader = isSpecialChar(textHeader) ? getSpecialChar(textHeader) : textHeader;
 				// surrounding headers with double quotes
 				textHeader = '"' + textHeader + '"';
 				headerArray.push(textHeader);
 			}
 			else {
 				textHeader = $(tableHeaders[i]).find('span');
 				for ( var j = 0;  j < textHeader.length ; j++ ) {
 					var lastHeader = $(textHeader[j]).html();
 					constructHeader(lastHeader);
 				}
 				
 				
 			}
 		}

 		rowArray.push(headerArray);
 		// ends parsing headers
 		// ===================================================

 		// ===================================================
 		// begin parsing data rows
 		var tableRow = table.find('tr');
 		for ( i = 0; i < tableRow.length; i++ ) {
 			// Check for attribute role="row"
 			var rowAttribute = $(tableRow[i]).attr("role");
 			if ( rowAttribute !== null && rowAttribute === "row" ) {
 				var tableCell = $(tableRow[i]).find('td');
 				for ( j = 0; j < tableCell.length; j++ ) {
 					var tableCellValues = $(tableCell[j]).find('span');
 					cellText ='';
					if(tableCellValues.find('.tk-trunc').length == 1){
						cellText = cellText+" "+$(tableCellValues[1]).text();
					}
					else {
						for(var cellContent=0; cellContent<tableCellValues.length;cellContent++){
							cellText = cellText+" "+$(tableCellValues[cellContent]).text();
						}
					}
 					// replaces any badly formatted special character string with correct special character
 					cellText = isSpecialChar(cellText) ? getSpecialChar(cellText) : cellText;
 					// surrounding cell text with double quotes
 					cellText = '"' + cellText + '"';
 					// append to cellArray
 					cellArray.push(cellText);
 					// end one row of record
 				};
 			}
 			
 			if(rowAttribute !== null ) {
 				// only push if cellArray length > 0
 				if ( cellArray.length > 0 )
 					rowArray.push(cellArray);
 				cellText = '';
 				cellArray = [];
 			}
 		}
 		// ends parsing data rows
 		// ===================================================

 		if ( bowser.name === 'Internet Explorer' ) {
 			var csvContent = "";
 			_.forEach(rowArray, function(infoArray, index) {
 				var dataString = infoArray.join(",");
 				csvContent += index < rowArray.length ? dataString + "\n" : dataString;
 			});

 			if (navigator.msSaveBlob) { // IE 10+
 				var blob = new Blob([csvContent],{type: "text/csv;charset=utf-8;"});
 	      navigator.msSaveBlob(blob, fileName);
 	    }
 			else { // IE 9
 				var iFrame = document.createElement("IFRAME");
 				iFrame.setAttribute("id", "exportIframe");
 				iFrame.style.display = "none";
 				document.body.appendChild(iFrame);
 				exportIframe.document.open("txt/html","replace");
 				exportIframe.document.write("sep=,\r\n" + csvContent);
 				exportIframe.document.close();
 				exportIframe.focus();
 				exportIframe.document.execCommand("SaveAs",true, fileName);
 				document.body.removeChild(iFrame);
 	        }
 		}
 		else { // not IE browser
 			csvContent = "data:text/csv;charset=utf-8,";
 			_.forEach(rowArray, function(infoArray, index) {
 				var dataString = infoArray.join(",");
 				csvContent += index < rowArray.length ? dataString + "\n" : dataString;
 			});

 			var uri = encodeURI(csvContent);
 			var anchor = document.createElement('a');
 			document.body.appendChild(anchor);
 			anchor.href = uri;
 			anchor.download = fileName;
 			anchor.click();
 			document.body.removeChild(anchor);
 		}
 	};
 });

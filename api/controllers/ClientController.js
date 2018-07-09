/**
 * ClientController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var toolbox = require('./toolbox.js');
var key = require('./globalVars.js').key;
var hostNport = require('./globalVars.js').hostNport;
var recordsPerPage = require('./globalVars.js').recordsPerPage;

//decode the field of data and use a space to separate different items
var dataFieldDecode = function(jsonData) {
	for(var i = 0; i < jsonData.length; i++) {
		for (var temp in jsonData[i]) {
			if(temp === 'firstName' || temp === 'lastName' || temp === 'DOB' || temp === 'username' || temp === 'people' 
				|| temp === 'emotions' || temp === 'trophy' || temp === 'question' || temp === 'street1' 
				|| temp === 'street2' || temp === 'city' || temp === 'state' || temp === 'zipcode' || temp === 'phone' 
				|| temp === 'pharmacy_name' || temp === 'pharmacy_street1' || temp === 'pharmacy_street2' 
				|| temp === 'pharmacy_city' || temp === 'pharmacy_state' || temp === 'pharmacy_zipcode' 
				|| temp === 'pharmacy_phone') {
				var stringData = separate(jsonData[i][temp], '*');
				jsonData[i][temp] = stringData;
			}
		}
	}
}

var separate = function(str, spliter) {
	if(str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	for(var i = 0; i < array.length; i++) {
		var item = toolbox.decode(array[i], '.');
		array[i] = item;
	}
	var result = array.join(' ');
	return result;
}

module.exports = {

	display: function (req, res) {
		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getusers/'+key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				dataFieldDecode(jsonData);
				if(keyword !== undefined) {
					toolbox.search(jsonData, keyword);
				}
				var result = toolbox.paging(jsonData, page, recordsPerPage);
				var maxPageNumber = toolbox.calculateMaxPageNumber(jsonData, recordsPerPage);
				// routeName is to help encapsulate the page index in a single ejs file
				return res.view('client', {
					data: result, 
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'client',
					keyword: keyword
				});	
			}
		});
	},

	search: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/client?keyword='+keyword);
	}
};
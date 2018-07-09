/**
 * ProviderController
 *
 * @description :: Server-side logic for managing providers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var toolbox = require('./toolbox.js');
var key = require('./globalVars.js').key;
var hostNport = require('./globalVars.js').hostNport;
var recordsPerPage = require('./globalVars.js').recordsPerPage;

var dataFieldDecode = function(jsonData) {
	for (var i = 0; i < jsonData.length; i++) {
		oneRecordDecode(jsonData[i]);
	}

}

//decode this field and change the date format
var oneRecordDecode = function(jsonData) {
	for (var temp in jsonData) {
		if (temp === 'title' || temp === 'license' || temp === 'videourl' || temp === 'bio' || temp === 'firstName' || temp === 'lastName') {
			var stringData = toolbox.decode(jsonData[temp], '.');
			jsonData[temp] = stringData;
		} else if (temp === 'typical_schedule') {
			var stringData = toolbox.typicalDateFormatDecode(jsonData[temp], '_');
			jsonData[temp] = stringData;
		} else if (temp === 'special_schedule') {
			var stringData = toolbox.specialDateFormatDecode(jsonData[temp], '_');
			jsonData[temp] = stringData;
		}
	}
	// do not show video url anymore
	delete jsonData['videourl'];
}

module.exports = {

	display: function(req, res) {
		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getallprovider/1/' + key
		}, function(error, response, body) { // data returned in the body
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
				return res.view('provider', {
					data: result, 
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'provider',
					keyword: keyword
				});
			}
		});

	},

	search: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/provider?keyword='+keyword);
	},

	editPage: function(req, res) {
		var id = req.params.id;
		var request = require('request');
		request.get({
			url: 'http://' + hostNport + '/get_one_provider/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				oneRecordDecode(jsonData);
				return res.view('providerEdit', {
					data: jsonData
				});
			}
		});

	},

	editSubmit: function(req, res) {
		var id = req.params.id;
		var title = encodeURIComponent(toolbox.encode(req.param('title')));
		var license = encodeURIComponent(toolbox.encode(req.param('license')));
		var firstName = encodeURIComponent(toolbox.encode(req.param('firstName')));
		var lastName = encodeURIComponent(toolbox.encode(req.param('lastName')));
		var gender = req.param('gender');
		var isPsychiatrist = req.param('isPsychiatrist');
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/edit_provider/' + id + '/' + title + '/' + license + '/' + firstName + '/' + lastName + '/' + gender + '/' + isPsychiatrist + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/provider');
			}
		});

	}
};
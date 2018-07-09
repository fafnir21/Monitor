/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var toolbox = require('./toolbox.js');
var key = require('./globalVars.js').key;
var hostNport = require('./globalVars.js').hostNport;
var recordsPerPage = require('./globalVars.js').recordsPerPage2;

module.exports = {

	display: function(req, res) {

		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getfeeds/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				if(keyword !== undefined) {
					toolbox.search(jsonData, keyword);
				}
				var result = toolbox.paging(jsonData, page, recordsPerPage);
				var maxPageNumber = toolbox.calculateMaxPageNumber(jsonData, recordsPerPage);
				return res.view('message', {
					data: result,
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'message',
					keyword: keyword
				});
				
			}
		});
	},

	search: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/message?keyword='+keyword);
	},

	editPage: function(req, res) {
		var id = req.params.id;
		var request = require('request');
		request.get({
			url: 'http://' + hostNport + '/getonefeed/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				return res.view('messageEdit', {
					data: jsonData
				});
			}
		});

	},

	editSubmit: function(req, res) {
		var id = req.params.id;
		var rawTitle = req.param('title');
		var rawText = req.param('text');
		var rawDate = req.param('date');
		var rawFeedtype = req.param('feedtype');
		var rawAuthor = req.param('author');

		var title = encodeURIComponent(rawTitle);
		var text = encodeURIComponent(rawText);
		var date = encodeURIComponent(rawDate);
		var feedtype = encodeURIComponent(rawFeedtype);
		var author = encodeURIComponent(rawAuthor);
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/updatefeed/' + id + '/' + title + '/' + text + '/' + date + '/' + feedtype + '/' + author + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/message');
			}
		});

	},

	delete: function(req, res) { //completely delete
		var id = req.params.id;
		var request = require('request');
		request.delete({
			url: 'http://' + hostNport + '/deletefeed/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/message');
			}
		});
	},

	addPage: function(req, res) {
		return res.view('messageAdd');
	},

	addSubmit: function(req, res) {

		var rawTitle = req.param('title');
		var rawText = req.param('text');
		var rawDate = req.param('date');
		var rawFeedtype = req.param('feedtype');
		var rawAuthor = req.param('author');

		//encode this item into URI component around character like '/'
		var title = encodeURIComponent(rawTitle);
		var text = encodeURIComponent(rawText);
		var date = encodeURIComponent(rawDate);
		var feedtype = encodeURIComponent(rawFeedtype);
		var author = encodeURIComponent(rawAuthor);
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/addfeed/' + title + '/' + text + '/' + feedtype + '/' + date + '/' + author + '/none/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
				return res.redirect('/message');
			} else {
				return res.redirect('/message');
			}
		});

	}

};
/**
 * ForumController
 *
 * @description :: Server-side logic for managing forums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var toolbox = require('./toolbox.js');
var key = require('./globalVars.js').key;
var deletedMark = require('./globalVars.js').deleteMark;
var hostNport = require('./globalVars.js').hostNport;
var recordsPerPage = require('./globalVars.js').recordsPerPage2;

//decode the field of data
var dataFieldDecode = function(jsonData) {
	for(var i = 0; i < jsonData.length; i++) {
		for(var temp in jsonData[i]) {
			if(temp === 'title' || temp === 'content' || temp === 'topic') {
				var stringData = toolbox.decode(jsonData[i][temp], '.');
				jsonData[i][temp] = stringData;
			}
		}
	}
}

//find all removed records
var filterRemoved = function(jsonData) {
	for(var i = 0; i < jsonData.length; i++) {
		if(jsonData[i]['content'] !== deletedMark) { 
			jsonData.splice(i, 1);
			i--; //after delete this element in the array, roll back one step
			continue;
		}
		for(var temp in jsonData[i]) {
			if(temp === 'title' || temp === 'content' || temp === 'topic') {
				var stringData = toolbox.decode(jsonData[i][temp], '.');
				jsonData[i][temp] = stringData;
			} 
		}
	}
}

//find all flagged records
var filterFlagged = function(jsonData) {
	for(var i = 0; i < jsonData.length; i++) {
		if(jsonData[i]['flags'] === null || jsonData[i]['flags'] <= 0) {
			jsonData.splice(i, 1);
			i--;
			continue;
		}
		for(var temp in jsonData[i]) {
			if(temp === 'title' || temp === 'content' || temp === 'topic') {
				var stringData = toolbox.decode(jsonData[i][temp], '.');
				jsonData[i][temp] = stringData;
			} 
		}
	}
}

module.exports = {

	display: function (req, res) {
		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getallpost/'+key
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
				return res.view('forum', {
					data: result, 
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'forum',
					keyword: keyword,
					type: 0 //0-normal, 1-flagged, 2-deleted
				});
			}
		});
	},

	displayFlagged: function(req, res) {
		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getallpost/'+key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				filterFlagged(jsonData);
				if(keyword !== undefined) {
					toolbox.search(jsonData, keyword);
				}
				var maxPageNumber = toolbox.calculateMaxPageNumber(jsonData, recordsPerPage);
				return res.view('forum', {
					data: jsonData,
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'forumFlagged',
					keyword: keyword,
					type: 1
				});
			}
		});
	},

	displayRemoved: function(req, res) {
		var request = require('request');
		var page = req.param('page');
		var keyword = req.param('keyword');
		if(page === undefined) 
			page = 1;
		request.get({
			url: 'http://' + hostNport + '/getallpost/'+key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				var jsonData = JSON.parse(body);
				filterRemoved(jsonData);
				if(keyword !== undefined) {
					toolbox.search(jsonData, keyword);
				}
				var maxPageNumber = toolbox.calculateMaxPageNumber(jsonData, recordsPerPage);
				return res.view('forum', {
					data: jsonData,
					page: parseInt(page),
					maxPageNumber: parseInt(maxPageNumber),
					routeName: 'forumRemoved',
					keyword: keyword,
					type: 2
				});
			}
		});
	},

	search: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/forum?keyword='+keyword);
	},

	searchFlagged: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/forumFlagged?keyword='+keyword);
	},

	searchRemoved: function(req, res) {
		var keyword = req.param('keyword');
		return res.redirect('/forumRemoved?keyword='+keyword);
	},

	//increase the value 'flag' field by 1
	flag: function(req, res) {
		var id = req.params.id;
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/addflag/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/forum');
			}
		});
	},

	//change the content of this post as [deleted by author]
	weakDelete: function(req, res) {
		var id = req.params.id;
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/deleteonepost/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/forum');
			}
		});
	},

	//physically delete
	strongDelete: function(req, res) {
		var id = req.params.id;
		var request = require('request');
		request.post({
			url: 'http://' + hostNport + '/deleteonepost_strong/' + id + '/' + key
		}, function(error, response, body) {
			if (error) {
				sails.log.error(error);
			} else {
				return res.redirect('/forum');
			}
		});
	}
};


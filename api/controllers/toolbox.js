// separate commonly used functions into this module

// encode from char to ASCII
var encode = function(stringData) {
	var stringResult = '';
	for(var i = 0; i < stringData.length; i++) {
		stringResult += stringData.charCodeAt(i).toString();
		stringResult += '.'
	}
	return stringResult;
}

// decode from ASCII to char
var decode = function(str, spliter) {
	if (str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	for (var i = 0; i < array.length; i++) {
		// check if item is a number
		if(!isNumeric(array[i])) {
			array.splice(i, 1);
			i--;
			continue;
		}
		var charElement = String.fromCharCode(array[i]);
		array[i] = charElement;
	}
	// create a string using the array
	var result = array.join('');
	return result;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var typicalDateFormatDecode = function(str, spliter) {
	if (str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	for (var i = 0; i < array.length; i++) {
		var item = typicalDateDecode(array[i], '.');
		array[i] = item;
	}
	var result = array.join('\n');
	return result;
}

var typicalDateDecode = function(str, spliter) {
	if (str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	var DayOfWeek;
	switch (array[0]) {
		case '0':
			DayOfWeek = 'Mon';
			break;
		case '1':
			DayOfWeek = 'Tue';
			break;
		case '2':
			DayOfWeek = 'Wed';
			break;
		case '3':
			DayOfWeek = 'Thu';
			break;
		case '4':
			DayOfWeek = 'Fri';
			break;
		case '5':
			DayOfWeek = 'Sat';
			break;
		case '6':
			DayOfWeek = 'Sun';
			break;
	}
	array[0] = DayOfWeek;
	var result = array.join(' ');
	return result;

}

var specialDateFormatDecode = function(str, spliter) {
	if (str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	for (var i = 0; i < array.length; i++) {
		var item = specialDateDecode(array[i], '.');
		array[i] = item;
	}
	var result = array.join('\n');
	return result;
}

var specialDateDecode = function(str, spliter) {
	if (str === null || spliter === null) {
		return null;
	}
	var array = str.split(spliter);
	var result = array.join('.');
	return result;
}

// get the data which will be displayed in this page, and store it in an array.
var paging = function(jsonData, pageNumber, recordsPerPage){
	if(jsonData === null || pageNumber === null || recordsPerPage === null || pageNumber < 0 || recordsPerPage < 0) {
		return false;
	}
	var maxPageNumber = calculateMaxPageNumber(jsonData, recordsPerPage);
	if(pageNumber < 1 || pageNumber > maxPageNumber) {
		return false;
	}
	var lowerRange = (pageNumber - 1) * recordsPerPage;
	var higherRange = pageNumber * recordsPerPage - 1;
	var result = new Array();
	for(var i = 0; i < jsonData.length; i++) {
		if(i < lowerRange || i > higherRange){
			continue;
		}
		result.push(jsonData[i]);
	}
	return result;
}

var calculateMaxPageNumber = function(jsonData, recordsPerPage){
	return Math.ceil(jsonData.length / recordsPerPage);
}

// just linear search, time complexity is O(n*m). n is length of data, and m is length of record.
var search = function(data, keyword) {
	for(var i = 0; i < data.length; i++) {
		var flag = false;
		for(var temp in data[i]) {
			if(data[i][temp] != null) {
				var index = data[i][temp].toString().indexOf(keyword);
				if(index > -1) {
					flag = true;
				}
			}
		}
		if(!flag) {
			data.splice(i, 1);
			i--;
		}
	}
}

exports.encode = encode;
exports.decode = decode;
exports.paging = paging;
exports.search = search;
exports.calculateMaxPageNumber = calculateMaxPageNumber;
exports.isNumeric = isNumeric;
exports.typicalDateFormatDecode = typicalDateFormatDecode;
exports.specialDateFormatDecode = specialDateFormatDecode;

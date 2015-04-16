'use strict';

var request = require('request-promise');
var moment = require('moment');
var config = require('./lib/config');
var logger = require('./lib/logger');


/*
| Useful vars
*/
var today = moment().format(config.dateFormat);


/*
| Emt Class
*/
var Emt = function(options){
	this.client = options && options.client || config.client,
	this.key = options && options.key || config.key
};

Emt.prototype.getArgs = function(args) {
	var _args = args || {};
	_args.idClient = this.client;
	_args.passKey = this.key;
	return _args;
};

Emt.prototype.request = function(message, args) {

	var url = config.URL + message + '.php';

	var requestData = {
		method: 'POST',
		uri: url,
		gzip: true,
		form: this.getArgs(args),

		// This is Spain madakafa!
		strictSSL: false
	};

	logger.info('[Request]', requestData);

	return request(requestData).then(function(response) {
		return JSON.parse(response).resultValues;
	});

};


Emt.prototype.getCalendar = function(_data) {

	var begin = (_data.begin) ? moment(_data.begin).format(config.dateFormat) : today;
	var end = _data.end;

	return this.request('bus/GetCalendar', {
		SelectDateBegin: begin,
		SelectDateEnd: end
	}).then(function(data) {
		return data;
	});

};


Emt.prototype.getGroups = function(_data) {
	var data = _data || {};

	return this.request('bus/GetGroups', {
		cultureInfo: data.cultureInfo || 'ES'
	}).then(function(data) {
		return data;
	});

};


Emt.prototype.getListLines = function(_data) {
	var data = _data || {};

	return this.request('bus/GetListLines', {
		SelectDate: moment().format(config.dateFormat),
		Lines: data.lines || ''
	}).then(function(data) {
		return data;
	});

};


var test = new Emt();

test.getListLines({lines: '116'}).then(function(data){
	console.log(data);
});

console.log(test);

module.exports = Emt;
#!/usr/bin/env node
'use strict';

var mylog = console.log;
var http = require('http');
var https = require('https');

var serverPort = 8099;
var httpServer = http.createServer(httpHandler);
var verbose = false;

httpServer.listen(serverPort);

function httpHandler(req, hr) {
	var url = req.url;
	mylog(url);
	var opts = {
		hostname: 'www.geckocodes.org',
		path: url,
	}
	query(opts, function(e, r) {
		if(e) {
			mylog(e);
			hr.end('');
		} else {
			r = r.toString();
mylog(r);
			hr.end(r);
		}
	});
}




function query(options, cb, postdata) {
	var opts = {
		port: 443,
		method: 'GET',
	};
	Object.keys(options).forEach(function(x) {
		opts[x] = options[x];
	})
	if(postdata && opts.method == 'POST') {
		opts.headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postdata.length,
		};
	}
if(verbose) mylog(opts);
	var req = https.request(opts, function(res) {
		if(verbose) mylog('STATUSCODE:', res.statusCode);
		if(verbose) mylog('HEADERS:', res.headers);
		var codeInfo = {};
		codeInfo[200] = 'OK          :';
		codeInfo[202] = 'Accepted    :Received but not yet acted upon';
		codeInfo[301] = 'Moved permanently';
		codeInfo[204] = 'No Content  :No response expected';
		codeInfo[404] = 'Not Found   :';
		codeInfo[405] = 'Method not allowed:';
		codeInfo[409] = 'Conflict    :';

		var code = res.statusCode;
		var info = codeInfo[code] || '';
		info = code + ':' + info;
		if(code==204) {
			cb(false, 'OK:' + info);
			return;
		} else if(code >= 400 && code<499) {
			cb(['Invalid status code', code, info]);
			return;
		}
		var data = '';

		res.on('data', function(d) {
			data += d;
			if(verbose) mylog('DATA:', d.toString());
		});
		res.on('end', function () {
			cb(false, data.toString());
		});
	});
	req.on('error', function(e) {cb(['ERROR:', e]);});
	if(postdata && opts.method == 'POST') {
		req.write(postdata);
	}
	req.end();
}

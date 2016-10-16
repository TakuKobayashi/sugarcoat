'use strict';

var http = require('http');
var https = require('https');
var qs = require('querystring');

getAccessToken(function (token) {
    translate(token, '疲れているから会いたくない。面倒くさい。', function (translated) {
        console.log(translated);
    });
});

function getAccessToken(callback) {
    var body = '';
    var req = https.request({
        host: 'datamarket.accesscontrol.windows.net',
        path: '/v2/OAuth2-13',
        method: 'POST'
    }, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            var resData = JSON.parse(body);
            callback(resData.access_token);
        });
    }).on('error', function (err) {
        console.log(err);
    });
    var data = {
        'client_id': 'sugarcoat',
        'client_secret': 'sugarcoatsugarcoatsugarcoat',
        'scope': 'http://api.microsofttranslator.com',
        'grant_type': 'client_credentials'
    };

    req.write(qs.stringify(data));
    req.end();
}

function translate(token, text, callback) {
    var options = '&to=en' +
            '&text=' + qs.escape(text) +
            '&oncomplete=translated';
    var body = '';
    var req = http.request({
        host: 'api.microsofttranslator.com',
        path: '/V2/Ajax.svc/Translate?' + options,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
        }
    }, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            eval(body);
        });
    }).on('error', function (err) {
        console.log(err);
    });

    req.end();

    function translated(text) {
        callback(text);
    }
}

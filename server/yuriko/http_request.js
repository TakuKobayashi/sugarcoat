'use strict';
var apiconfigInfo = JSON.parse(fs.readFileSync('../config/apiconfig.json', 'utf8'));

//requestをrequire
var request = require('request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

//Micarosoftの翻訳APIに必要
var http = require('http');
var https = require('https');
var qs = require('querystring');

//翻訳内容のセンテンス
var message     = "今日は大変疲れましたが楽しかったね";

//watsonのtone-analyzerのAPI
var username = apiconfigInfo.watson.username;
var password = apiconfigInfo.watson.password;
var result   = '';
var en_result= '';
//
//Micarosoftの翻訳API処理
//

//アクセストーク取得
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
    //作成したmaicrosoftの翻訳APIキー
    var data = {
        'client_id': apiconfigInfo.microsoft.client_id,
        'client_secret': apiconfigInfo.microsoft.client_secret,
        'scope': 'http://api.microsofttranslator.com',
        'grant_type': 'client_credentials'
    };

    req.write(qs.stringify(data));
    req.end();
}

//翻訳（日本語→英語）
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

//翻訳実行
getAccessToken(function (token) {
    translate(token, message, function (translated) {
      //watosonのtone-analyzerのAPI処理にかけるためにスペースを置換
      result    = translated.replace( / /g , "%20" ) ;
      en_result = result.replace( /!/g , "" ) ;
        console.log(translated);
        console.log(result);
        console.log(en_result);
    });
});

//
//watosonのtone-analyzerのAPI処理
//

//tone-analyzerのAPIオプションを定義
var options = {
  url: 'https://' + username + ':' + password + '@gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=' + en_result,
  method: 'GET',
  headers: headers,
  json: true
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(JSON.stringify(body));
  //コールバックで色々な処理
})

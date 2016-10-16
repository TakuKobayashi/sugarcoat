'use strict';

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
var message     = "めちゃくちゃ楽しいよ。ありがとう";
var res_message = message.replace( /。/g , "" ) ;

//watsonのtone-analyzerのAPI
var username = '7743d7b8-b987-42a9-b2bc-3abd6aec7884';
var password = 'OPCwL3dOfQoi';

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
        'client_id': 'sugarcoat',
        'client_secret': 'sugarcoatsugarcoatsugarcoat',
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
    translate(token, res_message, function (translated) {
      //watosonのtone-analyzerのAPI処理にかけるためにスペースを置換
      var result    = translated.replace( / /g , "%20" ) ;
      var en_result = result.replace( /!/g , "" ) ;

        //念のため取得文字を英語&＆スペース系削除
        console.log('query      ->' + res_message);
        console.log('translated ->' + translated + "\n");

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
          var json_result = JSON.stringify(body);
          var json_tone   = JSON.parse(json_result);
          var str_tone    = json_tone.document_tone.tone_categories[0];
          var other_score = 0;
          var score = 0;

          str_tone.tones.forEach(function(tones){
            console.log(tones.score + "->" + tones.tone_id);
              if(tones.score > other_score){
                other_score = tones.score;
                if(tones.tone_id == "joy"){
                  score ++;
                }
              }

          });
          console.log(score);


//          console.log(str_tone);
          //コールバックで色々な処理

        })
    });

});

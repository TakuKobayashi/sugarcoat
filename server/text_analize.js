var fs = require('fs');
var apiconfigInfo = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

//requestをrequire
var request = require('sync-request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var request = require('sync-request');

exports.getGooKeyWards = function(text) {
  var url = "https://labs.goo.ne.jp/api/keyword";
  var bodyObj = {"app_id":apiconfigInfo.goo.app_id,"title":text, "body":text}
  //オプションを定義
  var options = {
  	headers: headers,
    json: bodyObj
  }

  //リクエスト送信
  var res = request('POST', url, options);
  return JSON.parse(res.getBody("utf8"));
};

exports.getYahooKeyWards = function(text) {
  var url = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract";
  var bodyObj = {"appId":apiconfigInfo.yahoo.appId,"sentence":text, "output":"json"}
  //オプションを定義
  var options = {
    headers: headers,
    qs: bodyObj
  }

  //リクエスト送信
  var res = request('POST', url, options);
  return JSON.parse(res.getBody("utf8"));
};
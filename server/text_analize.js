var fs = require('fs');
var apiconfigInfo = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

//requestをrequire
var request = require('sync-request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var request = require('sync-request');

var url = "https://labs.goo.ne.jp/api/keyword";

exports.getKeyWards = function(text) {
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
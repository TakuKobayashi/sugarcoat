//requestをrequire
var request = require('request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var username = '7743d7b8-b987-42a9-b2bc-3abd6aec7884';
var password = 'OPCwL3dOfQoi';

//オプションを定義
var options = {
  url: 'https://' + username + ':' + password + '@gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=こんにちは',
  method: 'GET',
  headers: headers,
  json: true
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(JSON.stringify(body));
  //コールバックで色々な処理
})
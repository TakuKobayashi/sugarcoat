//requestをrequire
var request = require('request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8',
}

//オプションを定義
var options = {
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=こんにちは',
  method: 'GET',
  headers: headers,
  json: true,
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(body);
  //コールバックで色々な処理
})
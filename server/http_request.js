//requestをrequire
var request = require('request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var username = '7743d7b8-b987-42a9-b2bc-3abd6aec7884';
var password = 'OPCwL3dOfQoi';

//var url = 'https://' + username + ':' + password + '@gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=こんにちは';
//var url = 'https://' + username + ':' + password + '@gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=こんにちは';
var url = "https://labs.goo.ne.jp/api/keyword"

var bodyObj = {"app_id":"9bb031fc7245c2314b371d20d5a141795341e8795b2189385153cfa28ac2dc1f","request_id":"record001","title":"「和」をコンセプトとする 匿名性コミュニケーションサービス「MURA」 gooラボでのβ版のトライアル実施 ～gooの検索技術を使った「ネタ枯れ防止機能」によりコミュニティの話題活性化が可能に～","body":"NTTレゾナント株式会社（本社：東京都港区、代表取締役社長：若井 昌宏、以下、NTTレゾナント）は、同じ興味関心を持つ人と匿名でコミュニティをつくることができるコミュニケーションサービス「MURA」を、2015年8月27日よりgooラボ上でβ版サイトのトライアル提供を開始します。","max_num":3,"focus":"ORG"}
//オプションを定義
var options = {
  url: url,
  method: 'POST',
  headers: headers,
  json: true,
  body: bodyObj
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(JSON.stringify(body));
  //コールバックで色々な処理
})
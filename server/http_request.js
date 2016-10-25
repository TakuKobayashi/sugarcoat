//requestをrequire
var request = require('request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var appId = "dj0zaiZpPU1IMGFtd3cxYUQySiZzPWNvbnN1bWVyc2VjcmV0Jng9ZTU-"
var url = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract"

var bodyObj = {
	"appid":appId,
	"sentence":"「和」をコンセプトとする 匿名性コミュニケーションサービス「MURA」 gooラボでのβ版のトライアル実施 ～gooの検索技術を使った「ネタ枯れ防止機能」によりコミュニティの話題活性化が可能に～","body":"NTTレゾナント株式会社（本社：東京都港区、代表取締役社長：若井 昌宏、以下、NTTレゾナント）は、同じ興味関心を持つ人と匿名でコミュニティをつくることができるコミュニケーションサービス「MURA」を、2015年8月27日よりgooラボ上でβ版サイトのトライアル提供を開始します。",
	"output":"json"
}
//オプションを定義
var options = {
  url: url,
  method: 'POST',
  headers: headers,
  json: true,
  form: bodyObj
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(body);
  //コールバックで色々な処理
})
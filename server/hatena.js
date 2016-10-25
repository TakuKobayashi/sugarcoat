var xmlrpc = require('xmlrpc');

var client = xmlrpc.createClient({
	host: 'd.hatena.ne.jp',
	path: '/xmlrpc',
	port: 80
});

client.methodCall('hatena.getSimilarWord', [{"wordlist": ["オブラート"]}], function(error, value) {
  //Here we may get cookie received from server if we know its name
  console.log(value);
});
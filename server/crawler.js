var fs = require('fs');
var Sequelize = require ('sequelize');
var dbInfo = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
var sequelize = new Sequelize(dbInfo.prod.database, dbInfo.prod.user, dbInfo.prod.password, { host: dbInfo.prod.host, port: 3306, benchmark: true})

var emojiStrip = require('emoji-strip');

var twitter = require('twitter');
var apiconfigInfo = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

var output_sentences = sequelize.define('output_sentences', {
      sentence: Sequelize.STRING,
      scoreKind: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
output_sentences.sync();

var output_sentence_meta = sequelize.define('output_sentence_meta', {
      sentenceId: Sequelize.INTEGER,
      tag: Sequelize.STRING,
      sourceId: Sequelize.STRING,
      sourceRootUrl: Sequelize.STRING,
      sourceUserId: Sequelize.STRING,
      sourceUserName: Sequelize.STRING,
});
output_sentence_meta.sync();

var twitterClient = new twitter(apiconfigInfo.twitter);

//3秒間スリープ
//sleep.sleep(n);
var roopCount = 0;

var isExecute = false;
var isFinish = false;

var async = require('async');

setInterval(function() {
  if(isExecute) return;
  isExecute = true;
  console.log(roopCount);
  var lastId = -1;
  var options = {q: "オブラート", count: 100};
  if(lastId > 0){
  	options.max_id = lastId;
  }


    	console.log("start");
    	twitterClient.get('search/tweets', options, function(error, tweets, response){
  			console.log(roopCount);
    		var tweetCount = tweets.statuses.length || 0;
    		var bulkSenteces = [];
    		var bulkSenteceMetas = [];
    	for(var i = roopCount;i < tweetCount;++i){
    	  var sen = {};
      	  var meta = {};
      	  sen.scoreKind = "";
	      sen.score = 0;
	      // 絵文字を除去
	      sen.sentence = emojiStrip(tweets.statuses[i].text);
	      bulkSenteces.push(sen);

	      meta.sentenceId = i;
	      var texts = [];
	      tweets.statuses[i].entities.hashtags.forEach(function(h){
	    	  texts.push(h.text);
	      })
    	  meta.tag = texts.join(",");
    	  meta.sourceId = tweets.statuses[i].id + '';
    	  meta.sourceRootUrl = "https://twitter.com/";
    	  meta.sourceUserId = tweets.statuses[i].user.id + '';
    	  meta.sourceUserName = tweets.statuses[i].user.screen_name;
    	  bulkSenteceMetas.push(meta);
    	  if(tweetCount - 1 == i){
    	  	lastId = tweets.statuses[i].id;
    	  }
    	}
    	output_sentences.bulkCreate(bulkSenteces).error(function(err) {
          // この例だとa@c4とabc5がエラーになる
          console.log(JSON.stringify(err));
        });
    	output_sentence_meta.bulkCreate(bulkSenteceMetas).error(function(err) {
          // この例だとa@c4とabc5がエラーになる
          console.log(JSON.stringify(err));
        });
    	roopCount = roopCount + tweetCount;
    	isExecute = false;
    	if(tweetCount < 100){
    	  isFinish = true;
    	}
    	var query = tweets.search_metadata.next_results.substring(1);
    	options = JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      });
}, 1000);
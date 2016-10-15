var fs = require('fs');
var Sequelize = require ('sequelize');
var dbInfo = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
var sequelize = new Sequelize(dbInfo.prod.database, dbInfo.prod.user, dbInfo.prod.password, { host: dbInfo.prod.host, port: 3306 })

var emojiStrip = require('emoji-strip');

var twitter = require('twitter');
var apiconfigInfo = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

var output_sentences = sequelize.define('output_sentences', {
      sentence: Sequelize.STRING,
      scoreKind: Sequelize.STRING,
      score: Sequelize.FLOAT,
});

var output_sentence_meta = sequelize.define('output_sentence_meta', {
      sentenceId: Sequelize.INTEGER,
      tag: Sequelize.STRING,
      sourceId: Sequelize.STRING,
      sourceRootUrl: Sequelize.STRING,
      sourceUserId: Sequelize.STRING,
      sourceUserName: Sequelize.STRING,
});

var twitterClient = new twitter(apiconfigInfo.twitter);
var options = {q: "オブラート", count: 100};

var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
        '\ud7c9[\ude00-\udeff]',
        '[\u2600-\u27BF]'
];
var ex = new RegExp(ranges.join('|'), 'g');

twitterClient.get('search/tweets', options, function(error, tweets, response){
  console.log(JSON.stringify(tweets));
  var tweetCount = tweets.statuses.length || 0;
  var bulkSenteces = [];
  var bulkSenteceMetas = [];
  for(var i = 0;i < tweetCount;++i){
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
  }
  output_sentences.bulkCreate(bulkSenteces);
  output_sentence_meta.bulkCreate(bulkSenteceMetas);
});
var fs = require('fs');
var Sequelize = require ('sequelize');
var text_analize = require('./text_analize.js');

var dbInfo = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
var sequelize = new Sequelize(dbInfo.prod.database, dbInfo.prod.user, dbInfo.prod.password, { host: dbInfo.prod.host, port: 3306, benchmark: true})

var output_sentences = sequelize.define('output_sentences', {
      sentence: Sequelize.STRING,
      scoreKind: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
output_sentences.sync();

var output_words = sequelize.define('output_words', {
      sentenceId: Sequelize.INTEGER,
      word: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
output_words.sync();

var input_sentences = sequelize.define('input_sentences', {
      sentence: Sequelize.STRING,
      scoreKind: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
input_sentences.sync();

var input_words = sequelize.define('input_words', {
      sentenceId: Sequelize.INTEGER,
      word: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
input_words.sync();

var bulkSenteces = [];
var bulkWords = [];
var bulkSentecesIn = [];
var bulkWordsIn = [];

var mstData = fs.readFileSync('./mst/mst.csv', 'utf8');
var cells = mstData.split("\r\n");
for(var i = 0;i < cells.length;++i){
  var cell = cells[i];
  var csv = cell.split(",");
  if(!csv[1] || !csv[2]) continue;
  var sen = {};
  sen.scoreKind = "";
  sen.score = 0;
  sen.sentence = csv[2];

  var senIn = {};
  senIn.scoreKind = "";
  senIn.score = 0;
  senIn.sentence = csv[1];

  bulkSenteces.push(sen);
  bulkSentecesIn.push(senIn);

  var keywords = text_analize.getKeyWards(sen.sentence).keywords;
  console.log(JSON.stringify(keywords));
  var keywordsIn = text_analize.getKeyWards(senIn.sentence).keywords;
  console.log(JSON.stringify(keywordsIn));

  keywords.forEach(function(keyword){
    Object.keys(keyword).forEach(function(key){
      var word = {};
      word.sentenceId = i;
      word.word = key;
      word.score = keyword[key];
      bulkWords.push(word);
    });
  });
  keywordsIn.forEach(function(keyword){
    Object.keys(keyword).forEach(function(key){
      var word = {};
      word.sentenceId = i;
      word.word = key;
      word.score = keyword[key];
      bulkWordsIn.push(word);
    });
  });
};

output_sentences.bulkCreate(bulkSenteces).error(function(err) {
  // この例だとa@c4とabc5がエラーになる
  console.log(JSON.stringify(err));
});
output_words.bulkCreate(bulkWords).error(function(err) {
  console.log(JSON.stringify(err));
});
input_sentences.bulkCreate(bulkSentecesIn).error(function(err) {
  // この例だとa@c4とabc5がエラーになる
  console.log(JSON.stringify(err));
});
input_words.bulkCreate(bulkWordsIn).error(function(err) {
  console.log(JSON.stringify(err));
});
var text_analize = require('./text_analize.js');

var application = require('./application.js');
var sequelize = application.sequelize();

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

var joint = sequelize.define('joint_input_output', {
      inputSentenceId: Sequelize.INTEGER,
      outputSentenceId: Sequelize.INTEGER
});
joint.sync();

var bulkSenteces = [];
var bulkWords = [];
var bulkSentecesIn = [];
var bulkWordsIn = [];

var inout = {}

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

  inout[senIn.sentence] = sen.sentence;

  bulkSenteces.push(sen);
  bulkSentecesIn.push(senIn);

  var keywords = text_analize.getGooKeyWards(sen.sentence).keywords;
  console.log(JSON.stringify(keywords));
  var keywordsIn = text_analize.getGooKeyWards(senIn.sentence).keywords;
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


input_sentences.findAll().then(function(inputs){
  inputs.forEach(function(input){
    output_sentences.findOne({where: {sentence: inout[input.sentence]}}).then(function(output){
      joint.create({inputSentenceId: input.id, outputSentenceId: output.id});
    });
  });
});
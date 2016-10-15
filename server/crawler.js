var fs = require('fs');
var Sequelize = require ('sequelize');
var dbInfo = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
var sequelize = new Sequelize(dbInfo.prod.database, dbInfo.prod.user, dbInfo.prod.password, { host: dbInfo.prod.host, port: 3306 })

var input_sentences = sequelize.define('input_sentences', {
      sentence: Sequelize.STRING,
      scoreKind: Sequelize.STRING,
      score: Sequelize.FLOAT,
});
input_sentences.sync();

input_sentences.create({sentence: 'hogehoge', scoreKind: 'fugafuga', score: 0.1})
  .error(function(err) {
  	console.log(JSON.stringify(err));
    //エラー時の処理
  })
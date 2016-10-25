var fs = require('fs');
var Sequelize = require ('sequelize');
var dbInfo = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
var enviroment = "dev";

var apiconfigInfo = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

exports.sequelize = function() {
  return new Sequelize(dbInfo[enviroment].database, dbInfo[enviroment].user, dbInfo[enviroment].password, { host: dbInfo[enviroment].host, port: 3306, benchmark: true});
};
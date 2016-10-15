var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('crawlinfo', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    searchSentenceWord: { type: 'string', notNull: true},
    reachedLast: { type: 'boolean', notNull: true, default: false},
    currentPageNumber: { type: 'int', notNull: true, default: 0},
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
  	callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('crawlinfo', callback);
};

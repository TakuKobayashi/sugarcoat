var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('input_sentences', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    sentence: { type: 'text', notNull: true },
    scoreKind: { type: 'string'},
    score: { type: 'float', notNull: true, default: 0 },
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
    db.addIndex('input_sentences', 'input_words_score_kind_index', 'scoreKind', function(){
      db.addIndex('input_sentences', 'input_words_score_index', 'score', callback)
    })
  });
};

exports.down = function(db, callback) {
  db.dropTable('input_sentences', callback);
};

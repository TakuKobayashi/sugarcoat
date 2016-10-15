var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('output_sentences', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    sentence: { type: 'text', notNull: true },
    scoreKind: { type: 'string'},
    score: { type: 'float', notNull: true, default: 0 },
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
    db.addIndex('output_sentences', 'output_words_score_kind_index', 'scoreKind', function(){
      db.addIndex('output_sentences', 'output_words_score_index', 'score', callback)
    })
  });
};

exports.down = function(db, callback) {
  db.dropTable('output_sentences', callback);
};

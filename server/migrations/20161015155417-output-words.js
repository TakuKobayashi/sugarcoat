var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('output_words', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    sentenceId: { type: 'int', notNull: true  },
    word: { type: 'string', notNull: true },
    score: { type: 'float', notNull: true, default: 0},
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
    db.addIndex('output_words', 'input_words_sentence_id_index', 'sentenceId', function(){
      db.addIndex('output_words', 'input_words_word_index', 'word', callback)
    })
  });
};

exports.down = function(db, callback) {
  db.dropTable('output_words', callback);
};

var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('output_sentence_meta', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    sentenceId: { type: 'int', notNull: true  },
    tag: { type: 'string'},
    sourceId: { type: 'string'},
    sourceRootUrl: { type: 'string'},
    sourceUserId: { type: 'string'},
    sourceUserName: { type: 'string'},
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
    db.addIndex('output_sentence_meta', 'output_meta_sentence_id_index', 'sentenceId', function(){
      db.addIndex('output_sentence_meta', 'output_meta_source_user_id_index', 'sourceUserId', function(){
        db.addIndex('output_sentence_meta', 'output_meta_tag_index', 'tag', callback)
      });
    });
  });
};

exports.down = function(db, callback) {
  db.dropTable('output_sentence_meta', callback);
};

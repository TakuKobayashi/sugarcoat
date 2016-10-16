var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('joint_input_output', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    inputSentenceId: { type: 'int', notNull: true  },
    outputSentenceId: { type: 'int', notNull: true  },
    updatedAt: 'datetime',
    createdAt: 'datetime'
  }, function(){
    db.addIndex('joint_input_output', 'joint_input_index', 'inputSentenceId', function(){
      db.addIndex('joint_input_output', 'joint_output_index', 'outputSentenceId', callback)
    })
  });
};

exports.down = function(db, callback) {
  db.dropTable('joint_input_output', callback);
};

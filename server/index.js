var express = require('express');
var app = express();
var fs = require('fs');

var port = process.env.PORT || 3000;

//サーバーの立ち上げ
var http = require('http');

//指定したポートにきたリクエストを受け取れるようにする
var server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

var io = require('socket.io').listen(server);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server:server});

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

var connections = [];
wss.on('connection', function (ws) {
  console.log('connect!!');
  connections.push(ws);
  ws.on('close', function () {
    console.log('close');
    connections = connections.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
  });
  ws.on('message', function (message) {
    console.log('message:', message);
    connections.forEach(function (con, i) {
      con.send(message);
    });
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var sendMessage = function(res, message){
  connections.forEach(function (con, i) {
    con.send(message);
  });
  res.send({"message":message});
}

// app.js の app.postをお手本にして実装。herokuから受け取ってロジック呼び出す。
app.get('/fromHeroku', function (req, res) {
  console.log("/fromHeroku touched!");
  var message = req.param("ms");
  input_sentences.findOne({where: {sentence: {$like: "%" + message + "%"}}}).then(function(input){
    var id = 0;
    if(input){
      id = input.id;
    }
    joint.findOne({where: {inputSentenceId: id}}).then(function(j){
      if(!j){
        sendMessage(res, message);
        return;
      }
      output_sentences.findById(j.outputSentenceId).then(function(output) {
        var response = message;
        if(output){
          response = output.sentence
        }
        sendMessage(res, response);
      });
    });
  });


  // reqの中にどうやってjsonが入ってるのかまるっきりわからない！bodyの中に入ってるの？
//  var text = .req.params.ms;
  console.log("/fromHeroku is Accessed from %s", message);
//  var recipientId = messageData.recipient_id;
//  var messageId = messageData.message_id;
//  console.log("/fromHeroku is Accessed from %s", recipientId);

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
//    res.sendStatus(200);
});



//サーバーと接続されると呼ばれる
io.on('connection', function(socket){
  console.log('a user connected');
  //接続している、人達(socket)がサーバーにメッセーッジを送った時にcallbackされるイベントを登録
  //第一引数はイベント名
  socket.on('message', function(msg){
    //受け取った人以外でつながっている人全員に送る場合(broadcastを使う)
    //socket.broadcast.emit('message', 'hello');
    //受け取った人含めて全員に送る場合
    //位第一引数のイベント名に対して送る
    //socket.broadcast.emit('message', msg);
    io.emit('message', msg);
    console.log('message: ' + msg);
  });

  //サーバーとの接続が遮断されると呼ばれる
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

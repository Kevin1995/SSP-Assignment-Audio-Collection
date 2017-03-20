var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var dbConnectionInfo = {
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'b921d0b7f353bc',
  password : 'd05fc196',
  database : 'audio_collections'
};

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  
  username = username.trim();
  
  if (username.length == 0) {
    res.redirect('/login');
  }
  else {
    req.session.username = username;
    res.redirect('/');
  }
});

router.get('/', function(req, res, next) {
  var dbConnection = mysql.createConnection(dbConnectionInfo);
  dbConnection.connect();

  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      // Let's just ignore this
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    } else {
      // I really should do something better here
      console.log('Got a DB Error: ', err);
    }
  });

  dbConnection.query('SELECT * FROM Playlists', function(err, results, fields){
    if (err) {
      throw err;
    }

    var allPlaylists = new Array();

    for (var i = 0; i < results.length; i++) {
      var playlist = {};
      playlist.id = results[i].id;
      playlist.text = results[i].text;

      console.log(JSON.stringify(playlist));

      allPlaylists.push(playlist);
    }
   
    dbConnection.end();

    res.render('playlists', {playlists: allPlaylists});
  });

  router.get('/users/playlistCreated', function(req, res, next) {
  var dbConnection = mysql.createConnection(dbConnectionInfo);
  dbConnection.connect();

  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      // Let's just ignore this
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    } else {
      // I really should do something better here
      console.log('Got a DB Error: ', err);
    }
  });

  dbConnection.query('SELECT * FROM Songs', function(err, results, fields){
    if (err) {
      throw err;
    }

    var allSongs = new Array();

    for (var i = 0; i < results.length; i++) {
      var song = {};
      song.id = results[i].id;
      song.text = results[i].text;

      console.log(JSON.stringify(song));

      allSongs.push(song);
    }
   
    dbConnection.end();

    res.render('name_of_created_playlist', {songs: allSongs});
  });

});
});

module.exports = router;

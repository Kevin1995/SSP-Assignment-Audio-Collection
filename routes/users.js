var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var dbConnectionInfo = {
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'b921d0b7f353bc',
  password : 'd05fc196',
  database : 'audio_collections'
};

router.get('/createPlaylist', function(req, res, next) {
  res.render('new_playlist');
});

router.get('/playlistCreated', function(req, res, next) {
  res.render('name_of_created_playlist');
});

router.get('/songCreated', function(req, res, next) {
  res.render('song_page');
});

router.get('/newSong', function(req, res, next) {
  res.render('new_song');
});

router.post('/newPlaylist', function(req, res, next) {

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

  var playlist = {};
  playlist.text = req.body.thePlaylist;

  dbConnection.query('INSERT INTO Playlists (playlist_name) VALUES(?)',[playlist.text], function(err, results,fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) {
      throw err;
    }

    // notice that results.insertId will give you the value of the AI (auto-increment) field
    playlist.id = results.insertId;

    // Going to convert my joke object to a JSON string a print it out to the console
    console.log(JSON.stringify(playlist));

    // Close the connection and make sure you do it BEFORE you redirect
    dbConnection.end();


    res.redirect('/');
  });

  router.post('/newSongAdded', function(req, res, next) {

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

  var song = {};
  song.text = req.body.theSong;

  dbConnection.query('INSERT INTO Songs (song_name) VALUES(?)',[song.text], function(err, results,fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) {
      throw err;
    }

    // notice that results.insertId will give you the value of the AI (auto-increment) field
    song.id = results.insertId;

    // Going to convert my joke object to a JSON string a print it out to the console
    console.log(JSON.stringify(song));

    // Close the connection and make sure you do it BEFORE you redirect
    dbConnection.end();


    res.redirect('/');
  });

});
});

module.exports = router;

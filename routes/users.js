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
  playlist.date = new Date();
  playlist.text = req.body.thePlaylist;

  var mysqlDate = playlist.date.toISOString().slice(0, 19).replace('T', ' ');
  dbConnection.query('INSERT INTO Playlists (playlist_name, playlist_date) VALUES(?,?)',[playlist.text, mysqlDate], function(err, results,fields) {
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
});

module.exports = router;

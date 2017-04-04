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
  var userMessage = req.session.userMessage ? req.session.userMessage : "";
  req.session.userMessage = "";

  res.render('login', { msg: userMessage });
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

    var allPlaylists = results;

    // for (var i = 0; i < results.length; i++) {
    //   var playlist = {
    //     id: results[i].id,
    //     text: results[i].text
    //   };

    //   console.log(JSON.stringify(playlist));

    //   allPlaylists.push(playlist);
    // }
   
    dbConnection.end();
    // res.send({results});
    res.render('playlists', {playlists: allPlaylists});
  });
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

      var allSongs = results;

      // for (var i = 0; i < results.length; i++) {
      //   var song = {};
      //   song.id = results[i].id;
      //   song.text = results[i].text;
      //   song.url = results[i].url;

      //   console.log(JSON.stringify(song));

      //   allSongs.push(song);
      // }
   
      dbConnection.end();

      var hoho = req.query.id;
      console.log(hoho);

      res.render('name_of_created_playlist', {songs: allSongs, playlist_query: req.query.id});
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/login');
});

router.post('/login', function(req, res, next) {
  var uname = req.body.username;
  var pwd = req.body.password;

  var pool = req.app.get('dbPool');

  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database");
      throw err;
    }

    console.log("Connected to the DB");

    // If we receive an error event handle it. I have placed this here because of a
    // bug in the mysql package which causes a 'PROTOCOL_SEQUENCE_TIMEOUT' error
    connection.on('error', function(err) {
      if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
        // Let's just ignore this
        console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
      } else {
        // I really should do something better here
        console.log('Got a DB Error: ', err);
      }
    });

    connection.query('SELECT * FROM Users WHERE username=?',[uname], function(err, results, fields) {
      // And done with the connection. 
      connection.release();

      console.log('Query returned ' + JSON.stringify(results));

      if (err) {
        // Oh no something went wrong
        throw err;
      }
      else if ((results.length != 0) && (pwd == results[0].password)) {
        console.log('Successful login');
        req.session.username = uname;
        req.session.userID = results.insertId;

        res.redirect('/');
      }
      else if ((results.length != 0)  && (pwd != results[0].password)) {
        console.log('incorrect password');
        req.session.userMessage = "Incorrect password";
        res.redirect('/login');
      }
      else {
        req.session.userMessage = uname + " is not a registered username. Maybe you need to register first!";
        res.redirect('/login');
      }
    });
  });
});

router.get('/register', function(req, res, next){
  res.render('register');
});

router.post('/register', function(req, res, next) {
  var uname = req.body.username;
  var pwd = req.body.password;

  var pool = req.app.get('dbPool');

  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database");
      throw err;
    }

    console.log("Connected to the DB");

    // If we receive an error event handle it. I have placed this here because of a
    // bug in the mysql package which causes a 'PROTOCOL_SEQUENCE_TIMEOUT' error
    connection.on('error', function(err) {
      if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
        // Let's just ignore this
        console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
      } else {
        // I really should do something better here
        console.log('Got a DB Error: ', err);
      }
    });

    connection.query('INSERT INTO Users (username, password) VALUES(?,?)',[uname,pwd], function(err, results, fields) {
      // And done with the connection. 
      connection.release();

      if (err) {
        // Oh no something went wrong
        throw err;
      }

      req.session.username = uname;
      req.session.userID = results.insertId;

      res.redirect('/login');
    });
  });
});

module.exports = router;
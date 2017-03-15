var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var dbConnectionInfo = {
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'b921d0b7f353bc',
  password : 'd05fc196',
  database : 'audio_collections'
};

router.get('/playlists', function(req, res, next) {
  res.render('playlists', { title: 'Playlists' });  
});

router.get('/new_playlist', function(req, res, next) {
  res.render('add_playlist', { title: 'Add new Playlist' });  
});

router.get('/name_of_playlist', function(req, res, next) {
  res.render('playlist_name', { title: 'playlist_name' });  
});

router.get('/add_audio_file', function(req, res, next) {
  res.render('add_audio', { title: 'Add Audio Page' });  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;

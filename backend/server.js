const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./api');
const { Clients } = require('./models');

// ==============
// Initial Config
// ==============
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// ======================
// CORS (For Development)
// ======================
if(app.settings.env !== 'production') {
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
}

// ==========
// Middleware
// ==========
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===
// API
// ===
app.use('/api', api);

// ===================
// Production Settings
// ===================
if(app.settings.env == 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// ======
// Server
// ======
server.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = app;

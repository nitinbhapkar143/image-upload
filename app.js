var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var morgan = require('morgan');

var router = express.Router();
var appRoute = require('./app/routes/api')(router);
var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));
app.use('/api', appRoute);


app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/views/home.html');
});

app.listen(port, function(err){
    if(err) throw err;
    console.log('Server is running on http://localhost:' + port);
});
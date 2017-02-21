var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Restaurant = require('./Restaurant.model');
var db = 'mongodb://localhost/savour'; //Server db is savour
mongoose.Promise = global.Promise;

var app = express();

//Connect to database
mongoose.connect(db);
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

//Insert data into database test
/*var tempRest = new Restaurant({ Name: 'Yasuko Teriyaki', Location: 'Magnolia' });
tempRest.save(function (err, tempRest) {
    if (err) return console.error(err);
});*/

//Retrieve collections from database
app.get('/search', function (req, res) {
    console.log('Getting Restaurants...');
    var resultsStr = [];
    Restaurant.find(function (err, results) {
        if (err) {
            console.log('Getting Restaurants...');
            res.send('Error Has Occured')
        } else {
            //console.log(results);
            //res.json(results);
            
            console.log(results);



            resultsStr = JSON.parse(JSON.stringify(results))
            //stuff = JSON.parse(results);
            //console.log(resultsStr + "\n");

            //console.log(resultsStr);
            res.render('search', { title: 'Search', results : resultsStr });

        }

    });

});



var routes = require('./routes/index');
//var about = require('./routes/about');
//var add = require('./routes/add');
//var restaurant = require('./routes/restaurant');
//var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.get('/about', routes.about);
//app.get('/add', routes.add);
//app.get('/restaurant', routes.restaurant);
//app.get('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

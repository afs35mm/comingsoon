var express       = require('express');
var app           = express();
var igNode        = require('instagram-node');
var hbs           = require('express-hbs');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var RedisStore    = require('connect-redis')(session);

var config        = require('../../config');

app.use(cookieParser());
app.use(session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379,
    }),
    secret: config.redisSecret,
    resave: false,
    saveUninitialized: true
}));

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/../views/partials',
    defaultLayout: __dirname + '/../views/layout/default',
    layoutsDir: __dirname + '/../views/layout',
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/../views');

app.use(express.static('public'));

require('./routes')(app, config, igNode);

exports.run = function(port){
    app.listen(port);
    console.log('Listening on port %s', port || 3000);
}

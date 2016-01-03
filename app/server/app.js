var express       = require('express');
var app           = express();
var igNode        = require('instagram-node');
var hbs           = require('express-hbs');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var config        = require('../../config');

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/../views/partials',
    defaultLayout: __dirname + '/../views/layout/default',
    layoutsDir: __dirname + '/../views/layout',
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/../views');

app.use(express.static('public'));
app.use(cookieParser());

require('./routes')(app, config, igNode);

exports.run = function(port){
    app.listen(port);
    console.log('Listening on port %s', port || 3000);
}

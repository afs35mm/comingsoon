var express       = require('express');
var app           = express();
var ig            = require('instagram-node').instagram();
var hbs           = require('express-hbs');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var config        = require('../../config');

ig.use({
    client_id: config.clientId,
    client_secret: config.clientSecret
});

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/../views/partials',
    defaultLayout: __dirname + '/../views/layout/default',
    layoutsDir: __dirname + '/../views/layout',
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/../views');

app.use(express.static('public'));
app.use(cookieParser());

require('./routes')(app, config, ig);

exports.run = function(port){
    app.listen(port);
    console.log('Listening on port %s', port || 3000);
}

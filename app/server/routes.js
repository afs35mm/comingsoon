module.exports = function(app, config, ig) {
    app.get('/authorize-user', function(req, res){
        authorizeUser(req, res, config, ig);
    });
    app.get('/handleauth', function(req, res){
        handleauth(req, res, config, ig);
    });

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/profile', function (req, res) {
        res.render('profile');
    });
}

authorizeUser = function(req, res, config, ig) {
    res.redirect(ig.get_authorization_url(config.redirectUrl, { scope: ['likes'], state: 'a state' }));
};

handleauth = function(req, res, config, ig) {
    ig.authorize_user(req.query.code, config.redirectUrl, function(err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            res.cookie('instaToken',result.access_token, { maxAge: 900000, httpOnly: true });
            res.redirect('/profile');
        }
    });
};

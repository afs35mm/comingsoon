verifyAuthedUser = function(req, res, next) {
    if (req.cookies.instaToken) {
        next();
    } else {
        res.redirect('/');
    }
}

authorizeUser = function(req, res, config, ig) {
    res.redirect(ig.get_authorization_url(config.redirectUrl, { scope: ['likes'] }));
};

handleauth = function(req, res, config, ig) {
    ig.authorize_user(req.query.code, config.redirectUrl, function(err, result) {
        if (err) {
            console.log(err.body);
            res.render('profile', {
                errorMsg: 'Uh-oh there was an error with instagram :('
            });
        } else {
            res.cookie('instaToken', result.access_token, { maxAge: 900000, httpOnly: true });
            res.redirect('/profile');
        }
    });
};


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

    app.get('/profile', verifyAuthedUser, function (req, res) {

        ig.use({ access_token: req.cookies.instaToken });

        ig.user('3749600', function(err, result, remaining, limit) {
            // console.log(err);
            // console.log(result);
            console.log('werked!');
        });

        res.render('profile', {
            errorMsg: 'oh man, something is fucked'
        });
    });
}

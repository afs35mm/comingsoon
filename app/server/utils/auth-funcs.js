var crpytoFunc = require('./crypto-func');

exports.verifyAuthedUser = function(req, res, next) {
    if (req.cookies.igToken) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.authorizeUser = function(req, res, config, ig) {
    res.redirect(ig.get_authorization_url(config.redirectUrl, { scope: ['likes'] }));
};

exports.handleauth = function(req, res, config, ig) {
    new ig.authorize_user(req.query.code, config.redirectUrl, function(err, result) {
        if (err) {
            res.render('home', {
                errorMsg: 'Uh-oh there was an error with instagram :('
            });
        } else {
            var cookieOpts = {
                maxAge: config.cookieAge,
                httpOnly: true
            };
            res.cookie('igToken', result.access_token, cookieOpts);
            res.cookie('igUserId', crpytoFunc.encrypt(result.user.id), cookieOpts);
            res.redirect('/home');
        }
    });
};

exports.getNewIgObject = function(config, igNodeObj) {
    var ig = igNodeObj.instagram();
    ig.use({
        client_id: config.clientId,
        client_secret: config.clientSecret
    });
    return ig;
};

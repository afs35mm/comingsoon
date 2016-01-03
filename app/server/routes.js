var _ = require('lodash-node');
/**
* Authorization Funcs
*/
var verifyAuthedUser = function(req, res, next) {
    if (req.cookies.igToken) {
        next();
    } else {
        res.redirect('/');
    }
};

var authorizeUser = function(req, res, config, ig) {
    res.redirect(ig.get_authorization_url(config.redirectUrl, { scope: ['likes'] }));
};

var handleauth = function(req, res, config, ig) {
    new ig.authorize_user(req.query.code, config.redirectUrl, function(err, result) {
        if (err) {
            res.render('profile', {
                errorMsg: 'Uh-oh there was an error with instagram :('
            });
        } else {
            var cookieOpts = {
                maxAge: config.cookieAge,
                httpOnly: true
            };
            res.cookie('igToken', result.access_token, cookieOpts);
            res.cookie('igUserId', result.user.id, cookieOpts);
            res.redirect('/profile');
        }
    });
};

// Shitty ass MFing work around https://github.com/totemstech/instagram-node/issues/23
var getNewIgObject = function(config, igNodeObj) {
    var ig = igNodeObj.instagram();
    ig.use({
        client_id: config.clientId,
        client_secret: config.clientSecret
    });
    return ig;
}, ig;

/*
* Routez
*/
module.exports = function(app, config, igNode) {

    app.use(function(req, res, next){
        next();
    });

    app.get('/authorize-user', function(req, res){
        ig = getNewIgObject(config, igNode);
        authorizeUser(req, res, config, ig);
    });

    app.get('/handleauth', function(req, res){
        handleauth(req, res, config, ig);
    });

    app.get('/', function (req, res) {
        if (req.cookies.igToken) {
            res.redirect('profile');
        } else {
            res.render('index', {
                notLoggedIn: true
            });
        }
    });

    app.get('/profile', verifyAuthedUser, function (req, res, next) {
        if (!ig) ig = getNewIgObject(config, igNode);
        ig.use({ access_token: req.cookies.igToken });
        ig.user(req.cookies.igUserId, function(err, result, remaining, limit) {
            var clientData = {};
            if (err) {
                clientData.errorMsg = 'aw man, something went haywire :('
            } else {
                clientData.userInfo = _.pick(
                    result,
                    'username',
                    'bio',
                    'profile_picture',
                    'full_name',
                    'id'
                );
            }
            res.locals.clientData = clientData
            next();
        });
    }, function(req, res, next){
        res.render('profile', res.locals.clientData);
    });
}

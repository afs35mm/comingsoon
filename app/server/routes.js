var _          = require('lodash-node');
var authFuncs  = require('./utils/auth-funcs');
var crpytoFunc = require('./utils/crypto-func');
var ig; // Shitty ass MFing work around https://github.com/totemstech/instagram-node/issues/23

/*
* Routez
*/
module.exports = function(app, config, igNode) {

    app.use(function(req, res, next){
        next();
    });

    app.get('/authorize-user', function(req, res){
        ig = authFuncs.getNewIgObject(config, igNode);
        authFuncs.authorizeUser(req, res, config, ig);
    });

    app.get('/handleauth', function(req, res){
        authFuncs.handleauth(req, res, config, ig);
    });

    app.get('/', function (req, res) {
        if (req.cookies.igToken) {
            res.redirect('home');
        } else {
            res.render('index', {
                notLoggedIn: true
            });
        }
    });

    app.get('/logout', function (req, res) {
        res.clearCookie('igToken');
        res.clearCookie('igUserId');
        res.redirect('/');
    });

    app.get('/home', authFuncs.verifyAuthedUser, function (req, res, next) {
        if (!ig) ig = authFuncs.getNewIgObject(config, igNode);
        ig.use({ access_token: req.cookies.igToken });
        ig.user(crpytoFunc.decrypt(req.cookies.igUserId), function(err, result, remaining, limit) {
            var clientData = {};
            if (err) {
                clientData.errorMsg = 'aw man, something went haywire :('
            } else {
                clientData.userInfo = _.pick(
                    result,'username','bio','profile_picture','full_name','id'
                );
            }
            res.locals.clientData = clientData
            next();
        });
    }, function(req, res, next){
        res.render('home', res.locals.clientData);
    });

    app.get('*', function (req, res) {
        res.status(404).render('404');
    });
}

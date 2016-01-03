var ig  = require('instagram-node').instagram();
var config = require('../../config');

ig.use({
    client_id: config.clientId,
    client_secret: config.clientSecret
});

module.exports = ig;

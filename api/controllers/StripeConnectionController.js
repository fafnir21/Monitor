var platformKey = require('./globalVars.js').platformKey;

module.exports = {

  getCode: function(req, res) {

    var request = require('request');
    var code = req.param('code');

    request.post({
      url: 'https://connect.stripe.com/oauth/token?client_secret='+platformKey+'&code='+code+'&grant_type=authorization_code'
    }, function(error, response, body) {
      if (error) {
        sails.log.error(error);
      } else {
        var jsonData = JSON.parse(body);
        sails.log(jsonData);
      }
    });
  }
};
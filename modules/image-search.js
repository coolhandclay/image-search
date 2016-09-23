var request = require('request');
var apikey = process.env.BING_API_KEY;

module.exports = function(param, callback) {
     var options = {
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + param,
        headers: {
            'Ocp-Apim-Subscription-Key': apikey
        }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var b = JSON.parse(body);
        var info = b.value;
        var output = info.map(function(result) {
            var chunk = {};
            chunk.title = result.name;
            chunk.url = result.contentUrl;
            chunk.size = result.contentSize;
            return chunk;
        });
        return callback(output);
      }
    });
};


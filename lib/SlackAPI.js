var request       = require("request");
var h             = require("./helper");
var WebSocket     = require("ws");
var env           = require("../env");
var base_url      = "https://slack.com/api/";

module.exports = {
  get: function(api, opts, callback){
    var request_url = base_url + api + "?token=" + env.token;
    if( typeof opts == "object" ){
      opts = h.serialize(opts)
    }else{
      opts = ""
    }
    console.log("***Sending request to " + api);
    request(request_url + opts, function(err, response, body){
      body = JSON.parse(body);
      console.log("***Received " + response.statusCode + " response from " + api);
      if(callback) callback(body);
    })
  },

  listenFor: function(event, callback){
    var listenURL = base_url + "rtm.start?token=" + env.token;
    request(listenURL, function(err,res,body){
      var ws = new WebSocket(JSON.parse(body).url);
      ws.on(event, function(response){
        callback(JSON.parse(response));
      });
    });
  }
}

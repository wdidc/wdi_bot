"use strict";

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
  },

  refreshGroups: function(){
    console.log(this);
    this.get("groups.info", {channel: env.private_group_id}, function(response){
      global.bot.admin_ids = response.group.members;
      global.bot.private_group_name = response.group.name;
      global.bot.summon_admins = "<" + global.bot.admin_ids.join(">, <") + ">";
      console.log(global.bot)
    });
    this.get("groups.info", {channel: env.public_group_id}, function(response){
      global.bot.public_group_name = response.group.name;
    });
  }
}

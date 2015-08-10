var request   = require( "request" );
var WebSocket = require ( "ws" );
var env       = require( "./env" );

var h       = require("./lib/helper")();
var Message = require("./lib/message");
var SlackAPI= require("./lib/slack")();

request("https://slack.com/api/rtm.start?token=" + env.token, function(err,response,body){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", function( message ){
    var m = Message( JSON.parse(message) );
    if(!m.type) return;
    console.log(m.type + " from " + m.sender + " (" + m.user + ")")
    
    if(m.type == "mention" && m.sender == "instructor"){
      m.repost({from: m.sender, to: env.public_group_id})
    }
    if(m.type == "dm" && m.sender != "self"){
      SlackAPI.get_username(m.user, function(username){
        m.repost({from: m.sender, to: env.public_group_id})
        m.repost({from: username, to: env.private_group_id})
      });
    }

  });

});

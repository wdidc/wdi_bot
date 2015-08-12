var request   = require( "request" );
var WebSocket = require ( "ws" );
var env       = require( "./env" );

var h       = require("./lib/helper")();
var Message = require("./lib/message");
var SlackAPI= require("./lib/slack")();

SlackAPI.refresh_groups();

request("https://slack.com/api/rtm.start?token=" + env.token, function(err,response,body){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", function( message ){
    var m = Message( JSON.parse(message) );
    if(!m){
      return;
    }else{
      console.log(m);
    }

    if(m.group == "dm"){
      if(m.sender == "instructor") m.reply("Hey, Instructor! Please @mention your message to me in `" + global.bot.private_group_name + "`. DMs are intended for students.");
      if(m.sender == "student"){
        if(m.intent == "repost"){
          m.repost({from: m.sender, to: env.public_group_id})
          SlackAPI.get_username(m.user, function(username){
            m.repost({from: username, to: env.private_group_id})
          });
        }
      }
    }else
    if(m.group == "public"){

    }else
    if(m.group == "private"){
      if(m.is_mention){
        if(m.intent == "repost") m.repost({from: m.sender, to: env.public_group_id});
        if(m.intent == "command"){
          if(m.command == "edit") m.edit(m.time);
          if(m.command == "delete") m.delete(m.time);
          if(m.command == "refresh") SlackAPI.refresh_groups();
        }
      }
      if(m.intent == "join") SlackAPI.refresh_groups();
      if(m.intent == "leave") SlackAPI.refresh_groups();
    }

  });

});

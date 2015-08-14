var request   = require( "request" );
var WebSocket = require( "ws" );
var env       = require( "./env" );
var fs        = require("fs");

var h       = require("./lib/helper")();
var Message = require("./lib/message");
var SlackAPI= require("./lib/slack")();
var response = {
  commands: fs.readFile(__dirname + "/assets/commands.txt"),
  commands_instructor: fs.readFile(__dirname + "/assets/commands_instructor.txt")
}

SlackAPI.refresh_groups();

request("https://slack.com/api/rtm.start?token=" + env.token, function(err,response,body){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", function( message ){
    var m = Message( JSON.parse(message) );
    if(!m) return;
    else console.log("***New message received: " + JSON.stringify(m));

    if(m.group == "dm"){
      if(m.intent == "command"){
        switch(m.command.name.toLowerCase()){
          case "help":
            m.reply(response.commands);
            break;
          case "anonymous":
            m.repost({from: m.sender, to: env.public_group_id})
            SlackAPI.get_username(m.user, function(username){
              m.repost({from: username, to: env.private_group_id})
            });
            break;
          case "edit":
            if(m.sender != "instructor") return;
            if(!m.edit(m.command.args[0])) return;
            SlackAPI.get_username(m.user, function(username){
              m.repost({
                from: username,
                to: env.private_group_id,
                message: "Edited " + h.get_time(m.command.args[0]) + ": " + m.text
              })
            });
            break;
          case "delete":
            if(m.sender != "instructor") return;
            if(!m.delete(m.command.args[0])) return;
            SlackAPI.get_username(m.user, function(username){
              m.repost({
                from: username,
                to: env.private_group_id,
                message: "Deleted " + h.get_time(m.command.args[0])
              })
            });
            break;
          default:
            m.reply("Command not recognized.")
            break;
        }
      }else{
        m.reply("Hi there! Give me commands by direct messaging me with the command followed by `:`. For example:\n```\nHelp:\n```");
      }
    }

  });

});

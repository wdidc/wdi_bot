var request   = require( "request" );
var WebSocket = require( "ws" );
var env       = require( "./env" );
var fs        = require("fs");

var h       = require("./lib/helper")();
var Message = require("./lib/message");
var SlackAPI= require("./lib/slack")();

var boilerplate = {}
fs.readFile(__dirname + "/boilerplate/commands.txt", "utf8", function(e, d){
  boilerplate.commands = d;
})
fs.readFile(__dirname + "/boilerplate/commands_instructor.txt", "utf8", function(e, d){
  boilerplate.commands_instructor = d;
})

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
            m.reply(
              (function(){
                var output = boilerplate["commands"];
                if(m.sender == "instructor"){
                  output += "\n" + boilerplate["commands_instructor"]
                }
                return output;
              }())
            );
            break;
          case "anon":
            m.repost({from: m.sender, to: env.public_group_id}, function(ms){
                SlackAPI.get_username(m.user, function(username){
                  m.repost({
                    to: env.private_group_id,
                    message: "```\n" + username + " posted " + ms.ts.replace(".","") + ": " + m.text + "\n```"
                  })
                });
              }
            );
            break;
          case "edit":
            if(m.sender != "instructor") return;
            if(!m.edit(m.command.args[0])) return;
            SlackAPI.get_username(m.user, function(username){
              m.repost({
                to: env.private_group_id,
                message: "```\n" + username + " edited " + h.get_time(m.command.args[0]).replace(".","") + ": " + m.text + "\n```"
              })
            });
            break;
          case "delete":
            if(m.sender != "instructor") return;
            if(!m.delete(m.command.args[0])) return;
            SlackAPI.get_username(m.user, function(username){
              m.repost({
                to: env.private_group_id,
                message: "```\n" + username + " delete " + h.get_time(m.command.args[0]).replace(".","") + "\n```"
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

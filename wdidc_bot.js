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
});

SlackAPI.refresh_groups();

request("https://slack.com/api/rtm.start?token=" + env.token, function(err,response,body){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", function( message ){
    var m = Message( JSON.parse(message) );
    if(!m) return;
    else console.log("***New message received: " + JSON.stringify(m));

    if(m.group == "public"){
      if(/@instructors/ig.test(m.rawText)){
        SlackAPI.get_username(m.user, function(username){
          m.repost({
            from: username,
            to: env.private_group_id,
            message: global.bot.summon_admins + "\n```\n" + username + " requests instructors: " + m.text + "\n```"
          });
        });
      }
    }else
    if(m.group == "dm" && m.sender != "self"){
      if(m.intent == "command"){
        var command = m.command.name.toLowerCase();
        if(command == "help"){
          m.reply(
            boilerplate["commands"] + (m.sender == "instructor" ? boilerplate["commands_instructor"] : "")
          );
        }else
        if(command == "anon"){
          m.repost(
            {from: m.sender, to: env.public_group_id},
            function(ms){
              SlackAPI.get_username(m.user, function(username){
                m.repost({
                  to: env.private_group_id,
                  message: "```\n" + username + " posted " + ms.ts + ": " + m.text + "\n```"
                })
              });
            }
          );
        }else
        if(command == "instructors"){
          SlackAPI.get_username(m.user, function(username){
            m.repost({
              from: username,
              to: env.private_group_id,
              message: global.bot.summon_admins + "\n```\n" + username + " requests instructors: " + m.text + "\n```"
            });
          });
        }else
        if(m.sender == "instructor" && command == "edit"){
          if(!m.edit(m.command.args[0])) return;
          SlackAPI.get_username(m.user, function(username){
            m.repost({
              to: env.private_group_id,
              message: "```\n" + username + " edited " + m.command.args[0] + ": " + m.text + "\n```"
            })
          });
        }else
        if(m.sender == "instructor" && command == "delete"){
          if(!m.delete(m.command.args[0])) return;
          SlackAPI.get_username(m.user, function(username){
            m.repost({
              to: env.private_group_id,
              message: "```\n" + username + " delete " + m.command.args[0] + "\n```"
            })
          });
        }
        else{
          m.reply("Command not recognized. Try typing `Help:`.")
        }
      }else{
        m.reply("Hi there! Give me commands by direct messaging me with the command followed by `:`. For example, to see the 'help' menu, you'd DM me:\n>Help:");
      }
    }

  });

});

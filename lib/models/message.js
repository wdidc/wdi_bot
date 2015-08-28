"use strict";

module.exports = function(message){
  var env = require("../../env");
  var regexFor = (function(){
    function id(id){
      return new RegExp("(<@)?" + id + ">?:? *");
    }
    return {
      command   : new RegExp(/^[^:<>]*(?=:)/ig),
      argument  : new RegExp(/"[^"]+"|[^" ]+/ig),
      botID     : id(env.bot_id),
      id        : id
    }
  }());

  message.channelType = function(){
    if(!message.channel) return false;
    else if(message.channel[0] == "D" && message.text) return "dm";
    else return "group";
  }();

  if(!message.channelType) return false;

  message.group = function(){
    if(!message.channel) return false;
    else if(message.channel == env.public_group_id) return "public";
    else if(message.channel == env.private_group_id) return "private";
    else return "other";
  }();

  message.sender = function(){
    if(global.bot.admin_ids.indexOf(message.user) > -1) return "instructor";
    else return "student";
  }();

  message.mentionsBot = function(){
    if(message.text && new RegExp("@" + env.bot_id, "ig").test(message.text)) return true;
    else return false;
  }();

  message.command   = false;
  message.arguments = [];
  (function parseCommand(){
    var input;
    if(/@instructor(s?)/.test(message.text)) return(message.command = "instructors");
    input = message.text.match(regexFor.command);
    if(!input || input == -1) return false;
    input = input[0].match(regexFor.argument);
    message.text = message.text
      .replace(regexFor.botId, "")
      .replace(regexFor.command, "")
      .substring(1).trim();
    message.arguments = input;
    message.command = input.shift().toLowerCase();
  }());

  (function parseArguments(){
    var a, argument, argumentz;
    argumentz = message.arguments;
    for(a = 0; a < argumentz.length; a++){
      argument = argumentz[a];
      if(argument[0] == '"'){
        argumentz[a] = argument.substring(1, argument.length - 1);
      }
    }
    message.arguments = argumentz;
  }());

  return message;
}

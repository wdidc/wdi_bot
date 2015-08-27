"use strict";

var env = require("../env")

module.exports = {
  validate: function(message){
    if(
      !message.channel
      || !message.text
      || message.type == "presence_change"
      || message.type == "user_typing"
      || message.type == "group_leave"
      || message.subtype == "group_leave"
      || message.user == env.bot_id
    ){
      return false;
    }else{
      return true;
    }
  },

  format: function(message){
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

    message.rawText = message.text;

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

    message.command = "";
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
      message.command = input.shift().toLowerCase();
      message.arguments = input;
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

    message.mentions = function(atmention){
      if(message.text && new RegExp("@" + atmention, "ig").test(message.text)) return true;
      else return false;
    }

    return message;
  }
}

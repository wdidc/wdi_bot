var env = require( "../env" );
var h = require("./helperMethods");

module.exports = function(message){
  var regexForID = function(id){
    return new RegExp("(<@)?" + id + ">?:? *");
  }
  var regexFor = {
    command : new RegExp(/^[^:<>]*(?=:)/ig),
    argument: new RegExp(/"[^"]+"|[^" ]+/ig),
    botID : regexForID(env.bot_id)
  }

  if(
    !message.channel
    || message.type == "user_typing"
    || message.type == "group_leave"
    || message.user == env.bot_id
  ) return false;
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

  message.intent = function(){
    if(message.text && regexFor.command.test(message.text)) return "command";
    else if(message.subtype == "group_leave") return "leave";
    else if(message.subtype == "group_join") return "join";
    else if(message.subtype == "message_changed") return "edit";
    else if(message.subtype == "message_deleted") return "delete";
    else if(regexFor.botID.test(message.text)) return "botMention";
    else return false;
  }();

  message.sender = function(){
    if(global.bot.admin_ids.indexOf(message.user) > -1) return "instructor";
    else return "student";
  }();

  message.command = "";
  message.arguments = [];
  (function parseCommand(){
    var input;
    if(message.intent != "command") return false;
    input = message.text.match(regexFor.command);
    if(!input || input == -1) return false;
    input = input[0].match(regexFor.argument);
    message.text = message.text.replace(regexFor.botId, "").replace(regexFor.command, "").substring(1).trim();
    message.command = input.shift().toLowerCase();
    message.arguments = input;
  }());

  (function parseArguments(){
    var a, argument, arguments;
    if(message.intent != "command") return false;
    arguments = message.arguments;
    for(a = 0; a < arguments.length; a++){
      argument = arguments[a];
      if(argument.charAt(0) == '"'){
        arguments[a] = argument.substring(1, argument.length - 1);
      }
    }
    message.arguments = arguments;
  }());

  message.mentions = function(atmention){
    if(message.text && new RegExp("@" + atmention, "ig").test(message.text)) return true;
    else return false;
  }

  return message

}

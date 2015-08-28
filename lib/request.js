var env = require( "../env" );
var h = require("./helperMethods");

module.exports = function(message){
  var regexForID = function(id){
    return new RegExp("(<@)?" + id + ">?:? *");
  }
  var regexFor = {
    command : new RegExp("^[^:<>]*:"),
    botID : regexForID(env.bot_id)
  }

  if(
    !message.channel
    || message.type == "user_typing"
    || message.user == env.bot_id
  ) return false;
  message.rawText = message.text;

  message.group = function(){
    if(!message.channel) return false;
    else if(message.channel[0] == "D" && message.text) return "dm";
    else if(message.channel == env.public_group_id) return "public";
    else if(message.channel == env.private_group_id) return "private";
    else return false;
  }();

  if(!message.group) return false;

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

  message.arguments = [];
  message.command = function(){
    if(message.intent != "command") return false;
    var name, input = message.text.match(regexFor.command);
    if(!input || input == -1) return false;
    input = input[0].substring(0, input[0].length - 1).split(/ +/);
    message.text = message.text.replace(regexFor.botId, "").replace(regexFor.command, "").trim();
    name = input.shift().toLowerCase();
    message.arguments = input;
    return name;
  }();

  message.mentions = function(atmention){
    if(message.text && new RegExp("@" + atmention, "ig").test(message.text)) return true;
    else return false;
  }

  console.log(message);
  return message

}

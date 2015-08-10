var env = require( "../env" );
var SlackAPI = require("./slack")();
var h = require("./helper")()

module.exports = function(message){
  var cmd_regex = new RegExp("!!{.*}!!");

  message.type = (function(){
    if(message.text && message.text.match( env.bot_id )){
      return "mention"
    }
    if(message.text && message.channel && message.channel[0] == "D"){
      return "dm"
    }
    return false
  })()

  if(!message.type) return message;

  message.sender = function(){
    if(message.user == env.bot_id){
      return "self"
    }else if(message.channel == env.private_group_id){
      return "instructor"
    }else{
      return "student"
    }
  }()

  message.command = function(){
    var input = message.text.match(cmd_regex),
        command,
        timestamp;
    if(!input || input == -1) return false;
    input = input[0].slice(3,-3).split(" ");
    if(input.length != 2) return false;
    command = input[0];
    timestamp = input[1].slice(0,10) + "." + input[1].substring(10);
    return {cmd: command, time: timestamp}
  }()

  message.sans_bot_id = function(){
    return h.sans_id(env.bot_id, message.text);
  }()

  message.repost = function(opts, callback){
    SlackAPI.get("chat.postMessage",
      {
        channel: opts.to,
        as_user: true,
        text: "[*" + h.capitalize(opts.from) + "*] " + message.sans_bot_id,
      },
      callback ? callback : null
    )
  }

  message.edit = function(timestamp, callback){
    SlackAPI.get("chat.update",
      {
        channel: env.public_group_id,
        ts: timestamp ? timestamp : message.command.time,
        text: "[*" + h.capitalize(message.sender) + "*] " + h.sans_id(env.bot_id, message.text.replace(cmd_regex, ""))
      },
      callback ? callback : null
    )
  }

  message.delete = function(timestamp, callback){
    SlackAPI.get("chat.delete",
      {
        channel: env.public_group_id,
        ts: timestamp ? timestamp : message.command.time
      },
      callback ? callback : null
    )
  }

  return message

}

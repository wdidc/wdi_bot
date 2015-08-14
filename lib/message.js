var env = require( "../env" );
var SlackAPI = require("./slack")();
var h = require("./helper")()
var CronJob = require("cron").CronJob;

module.exports = function(message){
  var cmd_regex = new RegExp("^.*:(?= |$)"),
      id_regex = new RegExp("(<@)?" + env.bot_id + ">?:?");

  if(
    !message.channel
    || message.type == "user_typing"
    || message.user == env.bot_id
  ) return false;

  message.sans_bot_id = function(){
    if(message.text) return message.text.replace(id_regex, "");
    else return false;
  }();

  message.group = function(){
    if(!message.channel) return false;
    else if(message.channel[0] == "D" && message.text) return "dm";
    else if(message.channel == env.public_group_id) return "public";
    else if(message.channel == env.private_group_id) return "private";
    else return false;
  }();

  if(!message.group) return false;

  message.is_mention = function(){
    if(message.text && id_regex.test(message.text)) return true;
    else return false;
  }();

  message.intent = function(){
    if(message.text && cmd_regex.test(message.text)) return "command";
    else if(message.subtype == "group_leave") return "leave";
    else if(message.subtype == "group_join") return "join";
    else if(message.subtype == "message_changed") return "edit";
    else if(message.subtype == "message_deleted") return "delete";
    else return false;
  }();

  message.sender = function(){
    if(global.bot.admin_ids.indexOf(message.user) > -1) return "instructor";
    else return "student";
  }();

  message.command = (message.intent != "command") ? false : function(){
    var input = message.text.match(cmd_regex),
        time;
    if(!input || input == -1) return false;
    input = input[0].substring(0, input[0].length - 1).split(/ +/);
    message.text = message.sans_bot_id.replace(cmd_regex, "");
    return { name: input.shift(), args: input }
  }();

  message.repost = function(opts, callback){
    SlackAPI.get("chat.postMessage",
      {
        channel: opts.to,
        as_user: true,
        text: (opts.message || message.text)
      },
      callback ? callback : null
    )
  }

  message.reply = function(reply, callback){
    SlackAPI.get("chat.postMessage",
      {
        channel: message.channel,
        as_user: true,
        text: reply
      },
      callback ? callback : null
    )
  }

  message.edit = function(timestamp, callback){
    timestamp = h.get_time(timestamp)
    if(!timestamp) return false;
    SlackAPI.get("chat.update",
      {
        channel: env.public_group_id,
        ts: timestamp,
        text: "[*" + h.capitalize(message.sender) + "*] " + message.text
      },
      callback ? callback : null
    )
    return true
  }

  message.delete = function(timestamp, callback){
    timestamp = h.get_time(timestamp)
    if(!timestamp) return false;
    SlackAPI.get("chat.delete",
      {
        channel: env.public_group_id,
        ts: timestamp
      },
      callback ? callback : null
    )
    return true
  }

  message.remind = function(){
    var timer = message.command.args[0].replace(/_/g, " ");
    new CronJob(timer, function(){
      SlackAPI.get("chat.postMessage",
      {
        channel: env.public_group_id,
        as_user: true,
        text: message.text
      })
    },null,true)
  }

  return message

}

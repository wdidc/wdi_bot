var env = require( "../env" );
var SlackAPI = require("./slack")();

module.exports = function(message){

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

  message.sans_bot_id = function(){
    var regex = new RegExp("(<@)?" + env.bot_id + ">?:?")
    return message.text.replace(regex, "");
  }()

  message.repost = function(opts, callback){
    SlackAPI.get("chat.postMessage",
      {
        channel: opts.to,
        as_user: true,
        text: "[" + opts.from + "] " + message.sans_bot_id,
      },
      callback ? callback : null
    )
  }

  return message

}

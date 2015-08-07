var env = require( "../env" )
var h = require("./h")()
var SlackAPI = require("./slack")(env.token)

module.exports = function( message ){
  message = JSON.parse(message);

  if(message.text && message.text.match( env.bot_id )){
    message.type = "mention";
  }else if(message.text && message.channel && message.channel[0] == "D"){
    message.type = "dm";
  }else{
    return
  }
  message.text = message.text.replace("<@" + env.bot_id + ">: ", "");
  switch(message.type){
    case "mention":
      console.log("***Received mention from " + message.user);
      if(
        message.channel != env.private_group_id
      ||message.user == env.bot_id){
        break;
      }
      SlackAPI.get("chat.postMessage",
        {
          text: "[Instructor]: " + message.text,
          as_user: true,
          channel: env.public_group_id
        }
      );
      console.log("***Instructor posted a message")
      break;
    case "dm":
      console.log("***Received DM from " + message.user);
      SlackAPI.get_username(message.user, function(username){
        SlackAPI.get("chat.postMessage",
          {
            text: "[Student]: " + message.text,
            as_user: true,
            channel: env.public_group_id
          }
        );
        SlackAPI.notify(username + ": " + message.text)
      });
      break;
  }
}

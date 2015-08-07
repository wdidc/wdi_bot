var env = require( "../env" )
var SlackAPI = require("./slack")(env.token)

module.exports = function( ){

  return {
    instructor_message : function( message ){
      SlackAPI.get("chat.postMessage",
        {
          text: "[Instructor]: " + message.text,
          as_user: true,
          channel: env.public_group_id
        }
      );
      console.log("***Instructor posted a message")
    },
    student_message : function( message ){
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
    }
  }

}

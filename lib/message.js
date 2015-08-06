var env = require( "../env" );
var slack = require("../lib/slack")
var client = slack(env.token)

module.exports = function( message ){
  if (typeof message != "object"){
    message = JSON.parse( message );
  }
  return {
    isMention: function(){
      return message.text && message.text.match( "<@U08LS74MR>" );
    },
    isDirectMessage: function(){
      return message.text && message.channel && message.channel[0] == "D";
    },
    post: function( callback ){
      client.chat.postMessage( function( response ){
        callback( response );
      }, {
        channel: "G08LT3JQ4",
        text: "Message sent from Mocha."
      })
    }
  }
}

// request( "https://slack.com/api/groups.list?token=" + env.token, function( err, response, body ){
//   console.log( body );
// });

// var postSomething = function( text ){
//   var url = "https://slack.com/api/chat.postMessage?token=" + env.token + "&channel=" + env.group_id + "&text=" + text + "&username=AnonBot"
//   request( url, function( err, response, body ){
//     console.log( body );
//   });
// }

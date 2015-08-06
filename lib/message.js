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
    post: function( callback, opts ){
      client.chat.postMessage( function( response ){
        callback( response );
      }, opts )
    }
  }
}

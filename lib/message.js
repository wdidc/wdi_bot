var env = require( "../env" );
var slack = require("../lib/slack")
var client = slack(env.token)

module.exports = function( message ){
  if (typeof message != "object"){
    message = JSON.parse( message );
  }
  return {
    isMention: function(){
      return message.text && message.channel && message.channel[0] == "G" && message.user != "U08LS74MR";
    },
    isDirectMessage: function(){
      return message.text && message.channel && message.channel[0] == "D";
    },
    post: function( callback, opts ){
      client.chat.postMessage( function( response ){
        callback( response );
      }, opts )
      client.users.info( function( user ){
        client.chat.postMessage( function( response ){
          callback( response );
        }, {
          text: user.user.name + ": " + opts.text,
          as_user: true,
          channel: "G08N4NRA6"
        })
      }, {
        user: message.user
      })
    }
  }
}

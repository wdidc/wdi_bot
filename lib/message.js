var env = require( "../env" );
var slack = require("../lib/slack")
var client = slack(env.token)

module.exports = function( message ){
  return {
    isMention: function(){
      return message.text && message.text.match( env.bot_id );
    },
    isDirectMessage: function(){
      return message.text && message.channel && message.channel[0] == "D";
    },
    isAuthorized: function(){
      if(!env.allowed_ids) return true;
      for(var x = 0; x < env.allowed_ids.length; x++){
        if(env.allowed_ids[x] == message.user) return true;
      }
      return false;
    },
    post: function( opts ){
      console.log(opts.text);
      client.chat.postMessage( opts );
    },
    notify: function( notification ){
      client.users.info(
        function( user ){
          client.chat.postMessage( function( response ){
            console.log( response );
          }, {
            channel: env.private_group_id,
            as_user: true,
            text: user.user.name + ": " + notification
          })
        }, {
          user: message.user
        }
      )
    }
  }
}

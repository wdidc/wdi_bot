var env = require( "./env" );
var request = require( "request" );
var WebSocket = require ( "ws" );
var message = require( "./lib/message" );

request( "https://slack.com/api/rtm.start?token=" + env.token, function( err, response, body ){
  var ws = new WebSocket( JSON.parse( body ).url );
  ws.on( "message", function( msgObj ){
    msgObj = JSON.parse(msgObj);
    var msg = message( msgObj ),
        txt = msgObj.text;
    if( msg.isMention() ){
      console.log( "User was mentioned" );
    }else if( msg.isDirectMessage() ){
      console.log( "User was DM'd" );
      if( msg.isAuthorized() ){
        msg.post({
          channel: env.public_group_id,
          as_user: true,
          text: txt
        });
        msg.notify(txt);
      }else{
        msg.notify("UNAUTHORIZED: " + txt)
      }
    }
  })
});

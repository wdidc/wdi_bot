var env = require( "./env" );
var request = require( "request" );
var WebSocket = require ( "ws" );
var message = require( "./lib/message" );

request( "https://slack.com/api/rtm.start?token=" + env.token, function( err, response, body ){
  var ws = new WebSocket( JSON.parse( body ).url );
  ws.on( "message", function( msgObj ){
    var msg = message( msgObj );
    if( msg.isMention() || msg.isDirectMessage() ){
      console.log( msgObj );
      msg.post( function(res){
        console.log( res );
      }, {
        channel: env.group_id,
        text: JSON.parse(msgObj).text,
        username: "AnonBot",
        as_user: true
      })
    }
  })
});

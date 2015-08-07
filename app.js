var env = require( "./env" );
var request = require( "request" );
var WebSocket = require ( "ws" );
var message = require("./lib/message")

request( "https://slack.com/api/rtm.start?token=" + env.token, function( err, response, body ){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", message);
})

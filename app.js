var env = require( "./env" );
var request = require( "request" );
var WebSocket = require ( "ws" );

// request( "https://slack.com/api/groups.list?token=" + env.token, function( err, response, body ){
//   console.log( body );
// });

// var postSomething = function( text ){
//   var url = "https://slack.com/api/chat.postMessage?token=" + env.token + "&channel=" + env.group_id + "&text=" + text + "&username=AnonBot"
//   request( url, function( err, response, body ){
//     console.log( body );
//   });
// }

// if {message: ...} starts with D, AnonBot has received a direct message
// direct message is stored in {text: ...}
// if {text} contains <@U08LS74MR>, then we know it is a mention to AnonBot
// if {channel} is present, 



request( "https://slack.com/api/rtm.start?token=" + env.token, function( err, response, body ){
  var ws = new WebSocket( JSON.parse( body ).url );
  ws.on( "message", function( message ){
    console.log( message );
  })
});

var env = require( "./env" );
var request = require( "request" );

request( "https://slack.com/api/groups.list?token=" + env.token, function( err, response, body ){
  console.log( body );
});

var postSomething = function( text ){
  var url = "https://slack.com/api/chat.postMessage?token=" + env.token + "&channel=" + env.group_id + "&text=" + text + "&username=AnonBot"
  request( url, function( err, response, body ){
    console.log( body );
  });
}

postSomething( "beep boop" );

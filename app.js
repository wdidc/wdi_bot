var env = require( "./env" );
var h = require("./lib/h")()
var request = require( "request" );

var WebSocket = require ( "ws" );
var Anonbot = require("./lib/anonbot")();

request( "https://slack.com/api/rtm.start?token=" + env.token, function( err, response, body ){
  var ws = new WebSocket( JSON.parse( body ).url );

  ws.on( "message", function( message ){
    message = JSON.parse(message);

    if(message.text && message.text.match( env.bot_id )){
      message.type = "mention";
    }else if(message.text && message.channel && message.channel[0] == "D"){
      message.type = "dm";
    }else{
      return
    }
    message.text = message.text.replace("<@" + env.bot_id + ">: ", "");

    switch(message.type){
      case "mention":
        console.log("***Received mention from " + message.user);
        if(message.channel == env.private_group_id && message.user != env.bot_id){
          Anonbot.instructor_message( message )
        }
        break;
      case "dm":
        console.log("***Received DM from " + message.user);
        Anonbot.student_message( message )
        break;
    }
  });
})

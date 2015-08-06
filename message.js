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

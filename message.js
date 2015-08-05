module.exports = function( message ){
  return {
    isMention: function(){
      return message.text.match( "<@U08LS74MR>" );
    },
    isDirectMessage: function(){
      return message.channel[0] == "D";
    }
  }
}

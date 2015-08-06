var message = require( "../lib/message" );

var seeds = [
  // normal message
  {"type":"message","channel":"G08LT3JQ4","user":"U03PX5UA0","text":"this is any old message","ts":"1438805579.000011","team":"T0351JZQ0"},
  // mention
  {"type":"message","channel":"G08LT3JQ4","user":"U03PX5UA0","text":"this mentions <@U08LS74MR>","ts":"1438805588.000012","team":"T0351JZQ0"},
  // direct message
  {"type":"message","channel":"D08LU1H32","user":"U03PX5UA0","text":"this is a private message","ts":"1438805598.000003","team":"T0351JZQ0"},
  // user typing
  {"type": 'user_typing', "channel": 'D08M4TWMC', "user": 'U03PX5UA0'}
]

var assert = require( "assert" );
describe( "AnonBot", function(){
  describe( "mention", function(){
    it( "contains <@U08LS74MR>", function(){
      assert( message( seeds[1] ).isMention() );
      assert.ifError( message( seeds[0] ).isMention() )
      assert.ifError( message( seeds[2] ).isMention() )
    })
  })
  describe( "direct message", function(){
    it( "'s channel starts with D", function(){
      assert( seeds[2].channel[0] == "D" );
      assert.ifError( message( seeds[0] ).isDirectMessage() );
      assert.ifError( message( seeds[1] ).isDirectMessage() );
    })
    it("posts the direct message into the test group", function(done){
      var msg = message(seeds[2])
      msg.post(function(response){
        assert(response.ok)
        done();
      })
    })
  })
})


// if {message: ...} starts with D, AnonBot has received a direct message
// direct message is stored in {text: ...}
// if {text} contains <@U08LS74MR>, then we know it is a mention to AnonBot
// if {channel} is present,

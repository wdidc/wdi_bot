var request   = require( "request" );
var WebSocket = require( "ws" );
var env       = require( "../env" );
var seeds     = require( "../test/seeds" );

var h       = require("../lib/helperMethods");
var Message = require("../lib/message_in");
var Response= require("../lib/message_out");
var SlackAPI= require("../lib/SlackAPI");

global.bot = {}
global.bot.admin_ids = "U03LQC301,U03PX5UA0,U08N52D9A,U08NE835M";

var assert = require( "assert" );
describe( "Message", function(){
  describe( "ChannelType", function(){
    describe( "Mention", function(){
      it( "contains the bot's ID", function(){
        assert( seeds.pub_mention.text.match(env.bot_id) );
        assert.notEqual( Message( seeds.any_message ).intent, "botMention");
        assert.notEqual( Message( seeds.student_dm ).intent, "botMention" );
        assert.equal( Message( seeds.pvt_mention).intent, "botMention" );
      })
    })
    describe( "Direct Message", function(){
      it( "'s channel starts with D", function(){
        assert.equal( seeds.student_dm.channel[0], "D" );
        assert.equal( Message( seeds.student_dm ).channelType, "dm" );
        assert.notEqual( Message( seeds.pvt_mention ).channelType, "dm" );
      })
    })
  })
  describe( "Sender", function(){
    describe("when it is a mention", function(){
      describe("from the private group", function(){
        var message = Message( seeds.pvt_mention );
        it("is an instructor", function(){
          assert.equal( message.channel, env.private_group_id );
          assert.equal( message.sender, "instructor" );
        })
      })
    })
    describe("when it is a direct message", function(){
      describe("from an admin id", function(){
        it("is an instructor", function(){
          assert.equal(Message( seeds.instructor_dm ).sender, "instructor");
        })
      })
      describe("otherwise", function(){
        it("is a student", function(){
          assert.equal(Message( seeds.student_dm ).sender, "student");
        })
      })
    })
  })
  describe("Intent", function(){
    describe("Command", function(){
      it("begins with some text followed by a colon'", function(){

      })
    })
  })
})


describe("SlackAPI", function(){
  it("has a `get` function", function(){
    assert.equal(typeof SlackAPI.get, "function")
  })
  it("checks in with the slack api", function(done){
    SlackAPI.get("api.test",
      {},
      function( response ){
        assert( response.ok );
        done();
      }
    )
  })
  it("tests authentication", function(done){
    SlackAPI.get("auth.test",
      {},
      function( response ){
        assert( response.ok );
        done();
      }
    )
  })
  it("posts a message to a channel", function(done){
    SlackAPI.get("chat.postMessage",
      {
        channel: env.private_group_id,
        text: "Testing with Mocha"
      },
      function( response ){
        assert( response.ok );
        assert( response.message.subtype == "bot_message" );
        done();
      }
    )
  })
  it( "converts user id to name", function(done){
    SlackAPI.get("users.info",
      { user: "U03QDDUSL" },
      function( response ){
        assert( response.ok );
        assert.equal( response.user.name, "robertakarobin" );
        done();
      }
    )
  })
})

describe( "App", function(){

})

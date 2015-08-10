var request   = require( "request" );
var WebSocket = require( "ws" );
var env       = require( "../env" );
var seeds     = require( "../test/seeds" );

var h       = require("../lib/helper")();
var Message = require("../lib/message");
var SlackAPI= require("../lib/slack")();

var assert = require( "assert" );
describe( "Message", function(){
  describe( "Type", function(){
    describe( "Mention", function(){
      it( "contains the bot's ID", function(){
        assert( seeds[1].text.match(env.bot_id));
        for( var x = 1; x <= 5; x++ ){
          assert.equal(Message( seeds[x] ).type, "mention");
        }
        assert.notEqual( Message( seeds[0] ).type, "mention" );
        assert.notEqual( Message( seeds[6] ).type, "mention" );
      })
    })
    describe( "Direct Message", function(){
      it( "'s channel starts with D", function(){
        assert.equal( seeds[6].channel[0], "D" );
        assert.equal( Message( seeds[6] ).type, "dm" );
        assert.notEqual( Message( seeds[5] ).type, "dm" );
      })
    })
  })
  describe( "Sender", function(){
    describe("when from a user with the bot's id", function(){
      it("is itself", function(){
        assert.equal( seeds[3].user, env.bot_id );
        assert.equal( Message(seeds[3]).sender, "self" );
        assert.notEqual( seeds[2].user, env.bot_id );
        assert.notEqual( Message(seeds[2]).sender, "self" );
      })
    })
    describe("when it is a mention", function(){
      describe("from the private group", function(){
        var message = Message( seeds[4] );
        it("is an instructor", function(){
          assert.equal( message.channel, env.private_group_id );
          assert.equal( message.sender, "instructor" );
        })
      })
    })
    describe("when it is a direct message", function(){
      it("is a student", function(){
        var message = Message( seeds[6] );
        assert.equal( message.type, "dm" );
        assert.equal( message.sender, "student" );
      })
    })
  })
})

describe("SlackAPI", function(){
  it("is has a `get` function", function(){
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
      { user: "U03PX5UA0" },
      function( response ){
        assert.equal( response.user.name, "jshawl" );
        done();
      }
    )
  })
})

describe( "App", function(){
  describe("when it receives a mention", function(){
    describe("from an instructor", function(){
      it("reposts to the public group", function(done){
        var m = Message( seeds[4] );
        assert.equal(m.type, "mention")
        assert.equal(m.sender, "instructor")
        m.repost(
          {from: m.sender, to: env.public_group_id},
          function(response){
            assert(response.ok)
            done()
          }
        )
      })
    })
  })
  describe("when it receives a DM", function(){
    it("reposts to the public group", function(done){
      var m = Message( seeds[6] )
      assert.equal(m.type, "dm")
      m.repost(
        {from: m.sender, to: env.public_group_id},
        function(response){
          assert(response.ok)
          done()
        }
      )
    })
    it("reposts to the private group", function(){
      var m = Message( seeds[6] )
      assert.equal(m.type, "dm")
      m.repost(
        {from: m.sender, to: env.private_group_id},
        function(response){
          assert(response.ok)
          done()
        }
      )
    })
  })
})

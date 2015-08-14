var request   = require( "request" );
var WebSocket = require( "ws" );
var env       = require( "../env" );
var seeds     = require( "../test/seeds" );

var h       = require("../lib/helper")();
var Message = require("../lib/message");
var SlackAPI= require("../lib/slack")();

global.bot = {}
global.bot.admin_ids = "U03LQC301,U03PX5UA0,U08N52D9A,U08NE835M";

var assert = require( "assert" );
describe( "Message", function(){
  describe( "Group", function(){
    describe( "Mention", function(){
      it( "contains the bot's ID", function(){
        assert( seeds.pub_mention.text.match(env.bot_id) );
        assert( !Message( seeds.any_message ).is_mention);
        assert( !Message( seeds.student_dm ).is_mention );
      })
    })
    describe( "Direct Message", function(){
      it( "'s channel starts with D", function(){
        assert.equal( seeds.student_dm.channel[0], "D" );
        assert.equal( Message( seeds.student_dm ).group, "dm" );
        assert.notEqual( Message( seeds.pvt_mention ).group, "dm" );
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
      it("contains '!!{}!!'", function(){

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
      describe("which is a command", function(){
        describe("to update", function(){
          describe("by editing", function(){

          })
        })
      })
      describe("otherwise", function(){
        it("reposts to the public group", function(done){
          var m = Message( seeds.pvt_mention );
          assert(m.is_mention)
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
  })
  describe("when it receives a DM", function(){
    describe("from a student", function(){
      var m = Message( seeds.student_dm )
      assert.equal(m.group, "dm")
      it("reposts to the public group", function(done){
        m.repost(
          {from: m.sender, to: env.public_group_id},
          function(response){
            assert(response.ok)
            done()
          }
        )
      })
      it("reposts to the private group", function(){
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
})

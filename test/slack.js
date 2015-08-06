var assert = require("assert")
var slack = require("../lib/slack")
var env = require("../env")
var client = slack(env.token)

describe("slack", function(){
  it("is a function", function(){
    assert(typeof slack == "function")
  })
  it("has an access token", function(){
    assert(client.token)
  })
  it("checks in with the slack api", function(done){
    client.api.test(function(response){
      assert(response.ok)
      done()
    })
  })
  it("tests authentication", function(done){
    client.auth.test(function(response){
      assert(response.ok)
      done()
    })
  })
  it("lists channels", function(done){
    client.channels.list(function(response){
      assert(response.ok)
      done()
    })
  })
  it("lists channels with options", function(done){
    client.channels.list(function(response){
      assert(response.ok)
      done()
    })
  }, {
    exclude_archived: 1
  })
  it("gets info about a channel", function(done){
    client.channels.list(function(response){
      var channelId = response.channels[0].id
      client.channels.info(function(response){
        assert(response.ok)
        done()
      },{
        channel: channelId
      })
    })
  })
  it("posts a message to a channel", function( done ){
    client.chat.postMessage( function(response){
      assert( response.ok )
      assert( response.message.subtype == "bot_message" )
      done();
    }, {
      channel: "G08LT3JQ4",
      text: "Running from Mocha."
    })
  })
})

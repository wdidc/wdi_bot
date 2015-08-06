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
})
var assert = require("assert")
var slack = require("../lib/slack")

describe("slack", function(){
  it("is a function", function(){
    assert(typeof slack == "function")
  })
})
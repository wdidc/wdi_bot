"use strict";

var MessageResponder = require("./lib/MessageResponder");
var MessageReader    = require("./lib/MessageReader");
var SlackAPI         = require("./lib/SlackAPI");
var env              = require("./env");

global.bot = {}
global.bot.poll = {inProgress: false, members: [], responses: []};
SlackAPI.refreshGroups();
(function listenForMessage(){
  SlackAPI.listenFor("message", function(message){
    if(!MessageReader.validate(message)) return false;
    SlackAPI.get("users.info", {user: message.user}, function(userInfo){
      message.username = userInfo.user.name;
      MessageResponder(MessageReader.format(message));
    });
  });
}());

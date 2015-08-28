"use strict";

var ResponseTo       = require("./lib/controllers/messages");
var Message          = require("./lib/models/message");
var SlackAPI         = require("./lib/SlackAPI");
var env              = require("./env");
var cachedUsers      = {}

global.bot = {}
global.bot.poll = {inProgress: false, members: [], responses: []};
SlackAPI.refreshGroups();
SlackAPI.listenFor("message", function(message){
  if(
    !message.channel
    || !message.text
    || message.type == "presence_change"
    || message.type == "user_typing"
    || message.type == "group_leave"
    || message.subtype == "group_leave"
    || message.user == env.bot_id
  ) return false;
  if(!cachedUsers[message.user]){
    SlackAPI.get("users.info", {user: message.user}, function(userInfo){
      cachedUsers[message.user] = userInfo.user.name;
      respond();
    });
  }else respond();

  function respond(){
    message.username = cachedUsers[message.user];
    new ResponseTo(new Message(message));
  }
});

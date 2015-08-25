var MessageResponder = require("./lib/MessageResponder");
var MessageReader    = require("./lib/MessageReader");
var SlackAPI         = require("./lib/SlackAPI");
var env              = require("./env");

global.bot = {}
global.bot.poll = {inProgress: false, members: [], responses: []};

(function refreshGroups(){
  SlackAPI.get("groups.info", {channel: env.private_group_id}, function(response){
    global.bot.admin_ids = response.group.members;
    global.bot.private_group_name = response.group.name;
    global.bot.summon_admins = "<@" + global.bot.admin_ids.join(">, <@") + ">";
    console.log(global.bot)
  });
  SlackAPI.get("groups.info", {channel: env.public_group_id}, function(response){
    global.bot.public_group_name = response.group.name;
  });
}());

(function listenForMessage(){
  SlackAPI.listenFor("message", function(message){
    if(!MessageReader.validate(message)) return false;
    SlackAPI.get("users.info", {user: message.user}, function(userInfo){
      message.username = userInfo.user.name;
      MessageResponder(MessageReader.format(message));
    });
  });
}());

var ResponseTo       = require("./lib/Router");
var Message          = require("./lib/models/message");
var SlackAPI         = require("./lib/SlackAPI");
var env              = require("./env");
var cachedUsers      = {}

if(!global.botVars) global.botVars = {}
SlackAPI.refreshGroups();
SlackAPI.listenFor("message", function(input){
  if(
    !input.channel
    || !input.text
    || input.type == "presence_change"
    || input.type == "user_typing"
    || input.type == "group_leave"
    || input.subtype == "group_leave"
    || input.user == env.bot_id
  ) return false;
  if(!cachedUsers[input.user]){
    SlackAPI.get("users.info", {user: input.user}, function(userInfo){
      cachedUsers[input.user] = userInfo.user.name;
      respond();
    });
  }else respond();

  function respond(){
    input.username = cachedUsers[input.user];
    new ResponseTo(new Message(input));
  }
});

var SlackAPI = require("./SlackAPI");
var h = require("./helperMethods");
var env = require("../env");

var CronJob = require("cron").CronJob;

module.exports = function(message){

  function send(channel, text, callback){
    SlackAPI.get("chat.postMessage", {
        channel: channel,
        as_user: true,
        text: h.backtics(text || message.text)
      },
      callback || null
    );
  }

  function update(){
    SlackAPI.get("chat.update", {
      channel: env.public_group_id,
      ts: message.arguments[0],
      text: h.backtics(message.text)
    });
  }

  function destroy(){
    SlackAPI.get("chat.delete", {
      channel: env.public_group_id,
      ts: message.arguments[0]
    });
  }

  var respondWith = {};
  respondWith.edit = update;
  respondWith.delete = destroy;

  respondWith.postIn = {
    public : function(text, callback){
      send(env.public_group_id, text, callback);
    },
    private : function(text){
      var output = [
        "usr:" + message.username,
        "cmd:" + (message.command ? message.command : "nil"),
        "arg:" + (message.arguments.length > 0 ? message.arguments.join(",") : "nil")
      ].join(", ") + "\n" + (text || message.text);

      send(env.private_group_id, output);
    }
  }

  respondWith.reply = function(text){
    send(message.channel, text);
  }

  respondWith.instructorSiren = function(text, callback){
    respondWith.postIn.private(global.bot.summon_admins + "\n" + message.text, callback);
  }

  respondWith.anonymousMessage = function(){
    respondWith.postIn.public(undefined, function(anonymousPost){
      message.arguments.push(anonymousPost.ts);
      respondWith.postIn.private();
    });
  }

  return respondWith;
}

// message.remind = function(){
//   var timer = message.command.args[0].replace(/_/g, " ");
//   new CronJob(timer, function(){
//     SlackAPI.get("chat.postMessage",
//     {
//       channel: env.public_group_id,
//       as_user: true,
//       text: message.text
//     })
//   },null,true)
// }

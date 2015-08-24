var SlackAPI = require("./SlackAPI");
var h = require("./helperMethods");
var env = require("../env");
var reminder = require("./reminder");
var Poll = require("./poll");

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

  respondWith.poll = {
    new: function(startText, stopText){
      Poll.create(message.channel,
        function(dmChannel){
          send(dmChannel, startText);
        },
        function(groupChannel, tally){
          send(groupChannel, stopText + tally);
        }
      );
    },
    log: function(){
      return Poll.log(message.user, message.text);
    }
  }

  respondWith.reminder = {
    new: function(){
      reminder.new(message, function(){
          respondWith.reply();
        }, function(reminderID, cronTime){
          if(!reminderID) return respondWith.reply("Invalid cron.");
          respondWith.reply("Reminder " + reminderID + " is scheduled with cron " + cronTime + ".");
        }
      );
    },
    stop: function(){
      respondWith.reply("Reminder " + message.arguments[0] + " is cancelled.");
      reminder.stop(message.arguments[0]);
    },
    all: function(){
      reminder.all({where: {channelID: message.channel}}, function(output){
        respondWith.reply(output.join("\n"));
      });
    }
  }
  return respondWith;
}

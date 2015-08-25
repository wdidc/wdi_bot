var SlackAPI = require("./SlackAPI");
var h = require("./helperMethods");
var env = require("../env");
var Reminder = require("./reminder");
var Poll = require("./poll");

module.exports = function(message){

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
    new: function(startText){
      Poll.create(this.channel,
        function(dmChannel){
          send(dmChannel, startText);
        }
      );
    },
    log: function(){
      return Poll.log(message.user, message.text);
    },
    stop: function(){
      Poll.stop(function(groupChannel, tally){
        send(groupChannel, tally);
      });
    }
  }

  return respondWith;
}

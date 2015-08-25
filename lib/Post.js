var env           = require("../env" );
var SlackAPI      = require("./SlackAPI");

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

module.exports = function(message){
  this.message = message;

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

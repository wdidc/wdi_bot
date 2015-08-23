var SlackAPI = require("./SlackAPI");
var h = require("./helperMethods");
var env = require("../env");
var reminder = require("./reminder");
var poll = require("./poll");

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
  respondWith.poll = {};

  respondWith.poll.log = function(){
    var memberID = global.bot.poll.members.indexOf(message.user);
    //if(memberID < 0) return false;
    global.bot.poll.responses.push(message.text[0]);
    //delete global.bot.poll.members[memberID];
    return true;
  }
  respondWith.poll.tally = function(){
    var r, n, set = [], min = 0, max = 5;
    var rs = global.bot.poll.responses;
    var tally, q = rs.length, output = [];
    var aType, quantities = [], data = [];
    for(r = 0; r < q; r++){
      n = Number.parseInt(rs[r])
      if(!isNaN(n) && n >= min && n <= max) set.push(Math.round(n));
    }
    tally = h.tally(set);
    output.push("Question: " + message.text);
    for(n = min; n <= max; n++) output.push(n + " => " + (tally.quantities[n] || 0));
    for(aType in tally.data) data.push(aType + " " + tally.data[aType]);
    output.push("Total " + set.length + ", " + data.join(", "));
    return output.join("\n");
  }
  respondWith.poll.stop = function(){
    send(global.bot.poll.channel, respondWith.poll.tally());
    global.bot.poll.channel = "";
    global.bot.poll.inProgress = false;
    global.bot.poll.members = [];
    global.bot.poll.responses = [];
  }
  respondWith.poll.new = function(){
    var members;
    function iterateOverMembers(callback){
      for(m = 0; m < members.length; m++){
        SlackAPI.get("im.open",
          {user: members[m]},
          sendPoll
        );
      }
    }
    function sendPoll(chat){
      var channel = chat.channel.id;
      send(channel, "You've been asked a question:\n-----\n" + message.text + "\n-----\nPlease respond to me with a number between 0 and 5 within the next 7 seconds.");
    }
    SlackAPI.get("groups.info",
      {channel: message.channel},
      function(response){
        members = response.group.members;
        global.bot.poll.channel = message.channel;
        global.bot.poll.inProgress = true;
        global.bot.poll.members = members;
        iterateOverMembers(sendPoll);
        setTimeout(respondWith.poll.stop, 10 * 1000);
      }
    );
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
  respondWith.reminder = {
    new: function(){
      reminder.new(message, function(){
          respondWith.reply();
        }, function(reminderID, cronTime){
          if(!reminderID){
            respondWith.reply("Invalid cron.");
            return;
          }
          respondWith.reply("Reminder " + reminderID + " is scheduled with cron " + cronTime + ".");
        }
      );
    },
    stop: function(){
      respondWith.reply("Reminder " + message.arguments[0] + " is cancelled.");
      reminder.stop(message.arguments[0]);
    },
    all: function(){
      reminder.all({where: {channelID: message.channel}}, function(reminders){
        output = [];
        for(var r = 0; r < reminders.length; r++){
          output.push([reminders[r].id, reminders[r].cron, JSON.parse(reminders[r].message.replace("/","")).text].join(", "));
        }
        respondWith.reply(output.join("\n"));
      });
    }
  }
  return respondWith;
}

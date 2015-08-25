var SlackAPI= require("./lib/SlackAPI");
var responseTo = require("./lib/message_out");
var canned = require("./lib/boilerplate");

SlackAPI.refresh_groups();
global.bot.poll = {inProgress: false, members: [], responses: []};
SlackAPI.onMessage(function(message){
  respondWith = responseTo(message);
  console.log(message);
  if(message.sender == "self"){
    return;
  }else
  if(message.command == "help"){
    var dm = canned.instructionsFor.dm.all;
    var group = canned.instructionsFor.group.all;
    if(message.sender == "instructor"){
      dm = dm.concat(canned.instructionsFor.dm.instructors);
      group = group.concat(canned.instructionsFor.group.instructors);
    }
    respondWith.reply(dm.join("\n\n"));
    respondWith.reply(group.join("\n\n"));
  }else
  if(message.channelType == "group"){
    if(message.intent == "botMention"){
      respondWith.reply(canned.blurbs.atmention);
    }else
    if(message.mentions("instructors")){
      respondWith.postIn.public(canned.blurbs.instructorsNotified);
      respondWith.instructorSiren();
    }else
    if(message.intent == "command"){
      if(message.command == "allreminders"){
        respondWith.reminder.showAll();
      }else
      if(message.sender == "instructor"){
        if(message.command == "remindme"){
          respondWith.reminder.create();
        }else
        if(message.command == "stopreminder"){
          respondWith.reminder.cancel();
        }else
        if(message.command == "pollstop"){
          respondWith.poll.stop();
        }else
        if(message.command == "pollme"){
          if(!global.bot.poll.inProgress){
            respondWith.poll.new(
              "You've been asked a question:\n-----\n" + message.text + "\n-----\nPlease respond to me with a number between 0 and 5."
            );
          }else{
            respondWith.reply("A poll's already in progress!");
          }
        }
      }
    }
  }else
  if(message.channelType == "dm"){
    if(global.bot.poll.inProgress && respondWith.poll.log()){
      respondWith.reply("I've logged your response to the poll!")
    }else
    if(message.intent != "command"){
      respondWith.reply(canned.blurbs.hello);
    }else
    if(message.command == "anon"){
      respondWith.anonymousMessage();
    }else
    if(message.command == "instructors"){
      respondWith.instructorSiren();
    }else
    if(message.command == "remindme"){
      respondWith.reminder.create();
    }else
    if(message.command == "allreminders"){
      respondWith.reminder.showAll();
    }else
    if(message.command == "stopreminder"){
      respondWith.reminder.cancel();
    }else
    if(message.sender == "instructor"){
      if(message.command == "refresh"){
        SlackAPI.refresh_groups();
      }else
      if(message.command == "edit"){
        respondWith.edit();
        respondWith.postIn.private();
      }else
      if(message.command == "delete"){
        respondWith.delete();
        respondWith.postIn.private();
      }
    }
    else{
      respondWith.reply(canned.blurbs.error)
    }
  }

});

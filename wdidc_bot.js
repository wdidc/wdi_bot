var SlackAPI= require("./lib/SlackAPI");
var responseTo = require("./lib/response");
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
    respondWith.reply("**Direct Message (DM) Commands**:\n\n" + dm.join("\n\n"));
    respondWith.reply("**Group / Room Commands**:\n\n" + group.join("\n\n"));
  }else
  if(message.command == "remindme" && (message.sender == "instructor" || message.channelType == "dm")){
    respondWith.reminder.new();
  }else
  if(message.command == "stopreminder" && message.sender == "instructor"){
    respondWith.reminder.stop();
  }else
  if(message.command == "allreminders"){
    respondWith.reminder.all();
  }else
  if(message.channelType == "group"){
    if(message.intent == "botMention"){
      respondWith.reply(boilerplate.blurbs.atmention);
    }else
    if(message.mentions("instructors")){
      respondWith.postIn.public(boilerplate.blurbs.instructorsNotified);
      respondWith.instructorSiren();
    }else
    if(message.command == "pollme"){
      if(!global.bot.poll.inProgress){
        respondWith.poll.new();
      }else{
        respondWith.reply("A poll's already in progress!");
      }
    }
  }else
  if(message.channelType == "dm"){
    if(global.bot.poll.inProgress && respondWith.poll.log()){
      respondWith.reply("I've logged your response to the poll!")
    }else
    if(message.intent != "command"){
      respondWith.reply(boilerplate.blurbs.hello);
    }else
    if(message.command == "anon"){
      respondWith.anonymousMessage();
    }else
    if(message.command == "instructors"){
      respondWith.instructorSiren();
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
      respondWith.reply(boilerplate.blurbs.error)
    }
  }

});

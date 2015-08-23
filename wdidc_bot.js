var SlackAPI= require("./lib/SlackAPI");
var responseTo = require("./lib/response");
var boilerplate = require("./lib/boilerplate");

SlackAPI.refresh_groups();
SlackAPI.onMessage(function(message){
  respondWith = responseTo(message);
  if(message.sender == "self"){
    return;
  }else
  if(message.intent == "botMention"){
    respondWith.reply(boilerplate.blurbs.atmention);
  }else
  if(message.command == "help"){
    respondWith.reply([
      "**Anonbot commands**",
      boilerplate.instructionsFor.anon,
      boilerplate.instructionsFor.instructors,
      boilerplate.instructionsFor.remindme,
      boilerplate.instructionsFor.allreminders,
      boilerplate.instructionsFor.stopreminder
    ].join("\n\n"));
    if(message.sender == "instructor"){
      respondWith.reply([
        "**Instructors only**",
        boilerplate.instructionsFor.edit,
        boilerplate.instructionsFor.delete
      ].join("\n\n"));
    }
  }else
  if(message.command == "remindme"
  && (message.sender == "instructor" || message.group == "dm")){
    respondWith.reminder.new();
  }else
  if(message.command == "stopreminder" && message.sender == "instructor"){
    respondWith.reminder.stop();
  }else
  if(message.command == "allreminders"){
    respondWith.reminder.all();
  }else
  if(message.group == "public"){
    if(message.mentions("instructors")){
      respondWith.postIn.public(boilerplate.blurbs.instructorsNotified);
      respondWith.instructorSiren();
    }
  }else
  if(message.group == "dm"){
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

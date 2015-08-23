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
    if(message.command == "edit" && message.sender == "instructor"){
      respondWith.edit();
      respondWith.postIn.private();
    }else
    if(message.command == "delete" && message.sender == "instructor"){
      respondWith.delete();
      respondWith.postIn.private();
    }else
    if(message.command == "help"){
      respondWith.reply([
        boilerplate.instructionsFor.anon,
        boilerplate.instructionsFor.instructors
      ].join("\n\n"));
      if(message.sender == "instructor"){
        respondWith.reply([
          boilerplate.instructionsFor.edit,
          boilerplate.instructionsFor.delete
        ].join("\n\n"));
      }
    }
    else{
      respondWith.reply(boilerplate.blurbs.error)
    }
  }

});

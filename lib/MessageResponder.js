var Canned = require("./CannedResponses");

module.exports = function(message){
  console.log(message);
  if(message.sender == "self"){
    return;
  }else
  if(message.intent == "botMention"){
    respondWith.reply(Canned.blurbs.atmention);
  }
  if(message.mentions("instructors")){
    if(message.channelType == "group"){
      respondWith.postIn.public(Canned.blurbs.instructorsNotified);
    }
    respondWith.instructorSiren();
  }else
  if(message.intent != "command"){
    respondWith.reply(Canned.blurbs.hello);
  }else
  if(message.channelType == "group"){
    switch(message.command){
      case "allreminders":
      if(message.sender != "instructor") break;
      case "remindme":
      case "stopreminder":
      case "pollstop":
      case "pollme":
    }
  }else
  if(message.channelType == "dm"){
    switch(message.command){
      case "help":
      
    }
    if(message.command == "help"){
      var dm = Canned.instructionsFor.dm.all;
      var group = Canned.instructionsFor.group.all;
      if(message.sender == "instructor"){
        dm = dm.concat(Canned.instructionsFor.dm.instructors);
        group = group.concat(Canned.instructionsFor.group.instructors);
      }
      respondWith.reply(dm.join("\n\n"));
      respondWith.reply(group.join("\n\n"));
    }else
    if(global.bot.poll.inProgress && respondWith.poll.log()){
      respondWith.reply("I've logged your response to the poll!")
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
      respondWith.reply(Canned.blurbs.error)
    }
  }
}


//callback(true);respondWith.reply("Invalid time given.");
//respondWith.reply("Reminder " + reminder.id + " is scheduled with cron " + reminder.cron + ".");

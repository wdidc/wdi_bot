"use strict";

var Post    = require("./Post");
var Poll    = require("./Poll");
var Reminder= require("./Reminder");
var Canned  = require("./CannedResponses");
var Ixns    = Canned.instructionsFor;
var env     = require("../env");

Reminder.doWhat = function(reminderDB){
  Post.send(reminderDB.channel, "Reminder " + reminderDB.id + ": " + reminderDB.message);
}
Reminder.all({order: "id"}, function(reminderDB){
  Reminder.start(reminderDB, function(r){
    console.log("Resuming reminder " + r.id);
  });
});

module.exports = function(m){
  console.log(m);
  if(m.sender == "self") return;
  var post     = new Post(m);
  var reminder = _reminder(m, post);
  var poll     = _poll(m, post);
  var c = m.command;

  if(m.mentions(env.bot_id)){
    post.reply(Canned.blurbs.atmention);
    return;
  }

  if(c == "allreminders"){ reminder.showAll(); return; }

  if(c == "instructors" || c == "instructor"){
    post.reply(Canned.blurbs.instructorsNotified);
    post.siren();
    return;
  }

  if(m.channelType == "group"){
    if(m.sender == "instructor"){
      if(c == "remindme") reminder.create();
      if(c == "stopreminder") reminder.stop();
      if(c == "pollme") poll.create();
      if(c == "pollstop");
    }
  }

  if(m.channelType == "dm"){
    if(!c) post.reply(Canned.blurbs.error)
    if(c == "help"){
      post.reply(Ixns.dm.all.concat( m.sender == "instructor" ? Ixns.dm.instructors : []).join("\n\n"));
      post.reply(Ixns.group.all.concat( m.sender == "instructor" ? Ixns.group.instructors : []).join("\n\n"));
    }
    else if(c == "anon"){ post.public(); post.private(); }
    else if(c == "remindme") reminder.create();
    else if(c == "stopreminder") reminder.stop();
    else if(m.sender == "instructor"){
      if(c == "refresh"){ post.reply("Groups refreshed!"); post.refreshGroups(); }
      else if(c == "edit") post.edit();
      else if(c == "delete") post.destroy();
    }
  }
}

function _reminder(m, post){
  return {
    create: function(){
      Reminder.create(m, this.done);
    },
    done: function(reminder){
      if(!reminder) return post.reply("There's a problem with this reminder!");
      post.reply("Reminder " + reminder.id + " scheduled for " + reminder.cron + "!");
    },
    stop: function(){
      post.reply("Cancelled!");
      Reminder.cancel(m.arguments[0]);
    },
    showAll: function(){
      Reminder.all({where: {channel: m.channel}, order: "id"}, function(reminder){
        if(!reminder) post.reply("No reminders here!");
        else post.reply("Reminder " + [reminder.id, reminder.cron, reminder.message].join(", "));
      });
    }
  }
}

function _poll(m, post){
  return {
    create: function(){
      Poll.create(m, this.done);
    },
    done: function(){
      Poll.stop(function(channel, tally){
        post.reply("Done");
      });
    }
  }
}

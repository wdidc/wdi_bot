var CronJob = require("cron").CronJob;
var h = require("./helperMethods");
var Reminder = require("../db/connection").models.Reminder;

function Reminder(message){
  this.message = message;
}
Reminder.prototype = {
  clazz: {
    createFromDB: function(){
      addToDB({
        channelID: message.channel,
        cron: h.parseTime(message.arguments[0]),
        text: message.text
      })
      .then(function(reminder){
        if(start(reminder)) respondWith.reply("Invalid time given.");
        else respondWith.reply("Reminder " + reminder.id + " is scheduled with cron " + reminder.cron + ".");
      });
    },
    all: function(options, doWhat){
      Reminder.findAll(options).then(function(reminders){
        h.each(reminders, doWhat);
      });
    }
  },
  instance: {
    addToCrons: function(){
      try{
        crons[this.id] = new CronJob(this.cron, doWhat, null, true);
        return true;
      }catch(error){
        return false;
      }
    },
    stop: function(){
      crons[this.id].stop();
      Reminder.destroy({where: {id: this.id}});
    },
    cancel: function(){
      Reminder.stop(reminder.id);
    }
  }
}

function reminder(message){

  function start(reminder){
    return Reminder.addToCrons(reminder, function(){
      respondWith.reply(reminder.text);
    });
  }
  function showAll(){
    Reminder.all({where: {channelID: message.channel}}, function(reminder){
      respondWith.reply([reminder.id, reminder.cron, reminder.text].join(", "));
    });
  }
  return {
    create: create,
    cancel: cancel,
    showAll: showAll
  }
}

module.exports = {
  addToDB: addToDB,
  addToCrons: addToCrons,
  stop: stop,
  all: all
}

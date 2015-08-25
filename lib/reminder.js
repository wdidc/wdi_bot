var CronJob = require("cron").CronJob;
var h = require("./helper");
var Reminder = require("../db/connection").models.Reminder;

function Reminder(message){
  this.channel = message.channel;
  this.text = message.text;
  this.cron = message.arguments[0];
}

Reminder.prototype = {
  create: create,
  all: all,
  stop: stop,
  start: start
}

function create(callback){
  return Reminder.create({
    channelID: message.channel,
    cron: h.parseTime(message.arguments[0]),
    text: message.text
  })
  .then(function(reminder){
    if(start(reminder)) callback(false);
    else callback(true);
  });
}

function all(options, doWhat){
  Reminder.findAll(options).then(function(reminders){
    h.each(reminders, doWhat);
  });
}

function addToCrons(){
  try{
    crons[this.id] = new CronJob(this.cron, doWhat, null, true);
    return true;
  }catch(error){
    return false;
  }
}

function stop(){
  crons[this.id].stop();
  Reminder.destroy({where: {id: this.id}});
}

function cancel(){
  Reminder.stop(reminder.id);
}

function start(){
  return Reminder.addToCrons(reminder, function(){
    respondWith.reply(reminder.text);
  });
}

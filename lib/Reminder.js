var CronJob = require("cron").CronJob;
var h = require("./helper");
var Models = require("../db/connection").models;
var crons = {};

function Reminder(message){
  this.channel = message.channel;
  this.cron    = message.arguments ? message.arguments[0] : message.cron;
  this.content = message.text;
}

Reminder.prototype = {
  create: create,
}

function create(message, done){
  var cron = message.arguments[0];
  console.log(message);
  try{ new CronJob(cron); }
  catch(er){ console.log(er); cron = h.parseTime(cron); }
  if(!cron) return response(false);

  return Models.Reminder.create({
    channel: message.channel,
    cron: cron,
    content: message.text
  }).then(function(reminderDB){
    done(addToCrons(reminderDB));
  });
}

function start(reminderDB, callback){
  if(addToCrons(reminderDB)) callback(reminderDB);
  else callback(false);
}

function addToCrons(reminderDB){
  try{
    crons[reminderDB.id] = new CronJob(reminderDB.cron, function(){
      Reminder.doWhat(reminderDB);
    }, null, true);
    return reminderDB;
  }catch(error){
    return false;
  }
}

function cancel(id){
  if(crons[id]) crons[id].stop();
  return Models.Reminder.destroy({where: {id: id}});
}

function all(options, doWhat){
  return Models.Reminder.findAll(options).then(function(reminders){
    if(reminders.length == 0) reminders = [false];
    h.each(reminders, doWhat);
  });
}

var CronJob = require("cron").CronJob;
var h = require("./helper");
var Models = require("../db/connection").models;
var crons = {};

var Reminder = {
  start: start,
  doWhat: function(message){
    console.log(message);
  },
  all: function(options, doWhat){
    return Models.Reminder.findAll(options).then(function(reminders){
      h.each(reminders, doWhat);
    });
  },
  create: function(message, done){
    var cron = message.arguments[0];
    console.log(message);
    try{ new CronJob(cron); }
    catch(er){ console.log(er); cron = h.parseTime(cron); }
    if(!cron) return response(false);

    return Models.Reminder.create({
      channel: message.channel,
      cron: cron,
      message: message.text
    }).then(function(reminderDB){
      done(addToCrons(reminderDB));
    });
  },
  cancel: function(id){
    if(crons[id]) crons[id].stop();
    return Models.Reminder.destroy({where: {id: id}});
  }
}

module.exports = Reminder;

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

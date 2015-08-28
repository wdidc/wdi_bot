var CronJob = require("cron").CronJob;
var h       = require("../helper");
var DB      = require("../../db/connection").models;
var crons   = {};

module.exports = {
  all: function(options, callback){
    DB.Reminder.findAll(options).then(function(reminders){
      if(reminders.length == 0) return callback(false);
      h.each(reminders, callback);
    });
  },
  create: function(options, done){
    try{ cronJob = new CronJob(options.cron).stop(); }
    catch(er){ /*console.log(er);*/ options.cron = h.parseTime(options.cron); }
    if(!options.cron) return done(false);
    DB.Reminder.create(options).then(done);
  },
  delete: function(id, callback){
    var reminder;
    if(crons[id]) crons[id].stop();
    DB.Reminder.findById(id).then(function(reminder){
      if(!reminder) return callback(false);
      reminder.destroy();
      callback(reminder);
    });
  },
  addToCrons: function(reminder, callback){
    console.log("Adding Reminder " + reminder.r.id + " to crons.")
    try{
      return crons[reminder.r.id] = new CronJob(reminder.r.cron, callback, null, true);
    }catch(error){
      return console.log(error);
    }
  }
}

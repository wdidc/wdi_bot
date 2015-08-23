var CronJob = require("cron").CronJob;
var db = require("../db/connection");
var Reminder = db.models.Reminder;
var crons = {};

module.exports = {
  new: function(message, doWhat, done){
    var cronTime = message.arguments[0].replace(/_/g, " ");
    Reminder.create({
      channelID: message.channel,
      cron: cronTime,
      message: JSON.stringify(message)
    }).then(function(reminder){
      try{
        crons[reminder.id] = new CronJob(cronTime, doWhat, null, true);
        done(reminder.id, cronTime);
      }catch(error){
        done(false);
      }
    });
  },
  stop: function(reminderID){
    crons[reminderID].stop();
    Reminder.destroy({where: {id: reminderID}});
  },
  all: function(options, doWhat){
    Reminder.findAll().then(doWhat);
  }
}

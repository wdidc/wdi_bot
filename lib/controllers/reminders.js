var Reminder = require("../models/reminder");
var Post     = require("../models/post");
var h        = require("../helper");

Reminder.all({order: "id"}, function(r){
  if(r) return new RemindersController(null, r.dataValues).cronify();
});

function RemindersController(m, r){
  this.m = m;
  if(r) this.r = r;
}
RemindersController.prototype = {
  create: function(){
    var self = this;
    Reminder.create({
      channel: this.m.channel,
      cron: this.m.arguments[0],
      text: this.m.text
    }, function(r){
      self.r = r;
      self.send("Created");
      self.cronify();
    });
  },
  cronify: function(){
    var self = this;
    Reminder.addToCrons(self, function(){
      self.send();
    });
  },
  send: function(text){
    var self = this;
    var output = h.backtics(
      (text ? text + "\n-----\n" : "")
      + ["Reminder " + self.r.id, self.r.cron, self.r.text].join(", ")
    );
    console.log(output);
    Post.send(self.r.channel, output);
  },
  stop: function(){
    var self = this;
    Reminder.delete(this.m.arguments[0], function(r){
      if(!r) return self.m.post().reply("This reminder doesn't exist.");
      self.r = r;
      self.send("Canceled");
    });
  },
  showAll: function(){
    var self = this;
    Reminder.all({where: {channel: this.m.channel}, order: "id"}, function(r){
      if(r) return new RemindersController(null, r.dataValues).send();
    });
  }
}
module.exports = RemindersController;

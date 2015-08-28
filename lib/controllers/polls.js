var Post = require("../models/post");
var h    = require("../helper");

if(!global.bot) global.bot = {}
global.bot.poll = {inProgress: false}

function PollsController(m){
  this.m = m;
}
PollsController.prototype = {
  create: function(){
    var self = this;
    global.bot.poll = {
      channel: this.m.channel, inProgress: true, members: [], IMchannels: [], responses: []
    }
    Post.toEachMemberOf(this.m.channel, function(channel){
      global.bot.poll.IMchannels.push(channel);
      Post.send(channel, "Poll time! Please respond to the question below with a number between 0 and 5.\n-----\n" + self.m.text);
    });
  },
  done: function(){
    var min = 0, max = 5, n, averageType, output = [];
    global.bot.poll.inProgress = false;
    var results = h.averages(h.numsBetween(min, max, global.bot.poll.responses));
    for(n = min; n <= max; n++){ output.push(n + " => " + (results.quantities[n] || 0)); }
    for(averageType in results.data){ output.push(averageType + " => " + results.data[averageType]); }
    Post.send(global.bot.poll.channel, output.join("\n"));
  },
  log: function(){
    if(!global.bot.poll.inProgress || !this.m.text) return false;
    var IMchannel = global.bot.poll.IMchannels.indexOf(this.m.channel);
    if(IMchannel < 0) return false;
    global.bot.poll.responses.push(this.m.text[0]);
    delete global.bot.poll.IMchannels[IMchannel];
    return true;
  }
}
module.exports = PollsController;

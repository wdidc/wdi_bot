var Post = require("../models/post");
var h    = require("../helper");

if(!global.botVars) global.botVars = {}
global.botVars.poll = {inProgress: false}

function PollsController(m){
  this.m = m;
}
PollsController.prototype = {
  create: function(){
    var self = this;
    if(global.botVars.poll.inProgress) return Post.send(this.m.channel, "Poll already in progress!");
    global.botVars.poll = {
      channel: this.m.channel, inProgress: true, members: [], IMchannels: [], responses: []
    }
    Post.toEachMemberOf(this.m.channel, function(channel){
      global.botVars.poll.IMchannels.push(channel);
      Post.send(channel, "Poll time! Please respond to the question below with a number between 0 and 5.\n-----\n" + self.m.text);
    });
  },
  done: function(){
    var min = 0, max = 5, n, averageType, output = [];
    global.botVars.poll.inProgress = false;
    var results = h.averages(h.numsBetween(min, max, global.botVars.poll.responses));
    for(n = min; n <= max; n++){ output.push(n + " => " + (results.quantities[n] || 0)); }
    for(averageType in results.data){ output.push(averageType + " => " + results.data[averageType]); }
    Post.send(global.botVars.poll.channel, output.join("\n"));
  },
  log: function(){
    if(!global.botVars.poll.inProgress || !this.m.text) return false;
    var IMchannel = global.botVars.poll.IMchannels.indexOf(this.m.channel);
    if(IMchannel < 0) return false;
    global.botVars.poll.responses.push(this.m.text[0]);
    delete global.botVars.poll.IMchannels[IMchannel];
    return true;
  }
}
module.exports = PollsController;

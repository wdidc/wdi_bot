var Poll = require("../models/poll");

function PollsController(m){

}
PollsController.prototype = {
  create: function(){
    Poll.create(m, this.done);
  },
  done: function(){
    Poll.stop(function(channel, tally){
      post.reply("Done");
    });
  }
}
module.exports = PollsController;

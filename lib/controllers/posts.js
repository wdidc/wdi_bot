var Post = require("../models/post");
var env  = require("../../env");
var h    = require("../helper");

function PostsController(m){
  this.m = m;
}
PostsController.prototype = {
  send: function(channel, text, callback){
    Post.send(channel, text, callback);
    return this;
  },
  edit: function(){
    Post.edit(env.public_group_id, this.m.arguments[0], this.m.text);
    return this.private();
  },
  delete: function(){
    Post.destroy(env.public_group_id, this.m.arguments[0]);
    return this.private();
  },
  reply: function(text){
    return this.send(this.m.channel, text || this.m.text);
  },
  public: function(callback){
    return this.send(env.public_group_id, this.m.text, callback);
  },
  anon: function(){
    var post = this;
    this.public(function(message){
      post.m.arguments = [message.ts]
      post.private();
    });
  },
  private: function(text){
    var output = (text || this.m.text) + "\n"
      + this.m.username
      + "." + (this.m.command || "nil")
      + "(" + (this.m.arguments.length > 0 ? this.m.arguments.join(",") : "null") + ")";
    return this.send(env.private_group_id, output);
  },
  siren: function(){
    return this.private(this.m.text + "\n" + "-----" + "\n" + global.botVars.summon_admins);
  },
  refreshGroups: function(){
    this.reply("Groups refreshed!");
    Post.refreshGroups();
  }
}
module.exports = PostsController;

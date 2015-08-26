"use strict";

var env           = require("../env" );
var h             = require("./helper");
var SlackAPI      = require("./SlackAPI");

function Post(message){
  this.m = message;
}
Post.prototype = {
  send: send,
  edit: edit,
  destroy: destroy,
  public: pub,
  private: pvt,
  siren: instructorSiren,
  reply: reply,
  refreshGroups: SlackAPI.refreshGroups.bind(SlackAPI)
}
Post.send = send;
module.exports = Post;

function send(channel, text, callback){
  SlackAPI.get("chat.postMessage", {
      channel: channel || this.m.channel,
      as_user: true,
      text: h.backtics(text || this.m.text)
    },
    callback || null
  );
}

function edit(){
  SlackAPI.get("chat.update", {
    channel: env.public_group_id,
    ts: message.arguments[0],
    text: h.backtics(this.m.text)
  });
}

function destroy(){
  SlackAPI.get("chat.delete", {
    channel: env.public_group_id,
    ts: this.m.arguments[0]
  });
}

function pub(text, callback){
  this.send(env.public_group_id, text || this.m.text, callback);
}

function pvt(text){
  var output = [
    "usr:" + this.m.username,
    "cmd:" + (this.m.command || "nil"),
    "arg:" + (this.m.arguments.length > 0 ? this.m.arguments.join(",") : "nil")
  ].join(", ") + "\n" + (text || this.m.text);
  this.send(env.private_group_id, output);
}

function reply(text){
  this.send(this.m.channel, text || this.m.text);
}

function instructorSiren(callback){
  this.private(global.bot.summon_admins + "\n" + this.m.text, callback);
}

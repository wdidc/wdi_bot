var Canned  = require("./CannedResponses");
var Ixns    = Canned.instructionsFor;
var Reminder= require("./controllers/reminders");
var Poll    = require("./controllers/polls");
var Post    = require("./controllers/posts");

module.exports = function(m){
  var c = m.command;
  if(m.sender == "self") return;

  var post = m.post = function(){
    return new Post(m);
  }
  var reminder = m.reminder = function(){
    return new Reminder(m);
  }
  var poll = m.poll = function(){
    return new Poll(m);
  }

  if(m.mentionsBot) return post().reply(Canned.blurbs.atmention);
  if(c == "allreminders") return reminder().showAll();
  if(c == "instructors" || c == "instructor") return post().siren().reply(Canned.blurbs.notified);

  if(m.channelType == "group"){
    if(m.sender == "instructor"){
      if(c == "remindme") reminder().create();
      if(c == "stopreminder") reminder().stop();
      if(c == "pollme") poll().create();
      if(c == "pollstop") poll().done();
    }
  }

  if(m.channelType == "dm"){
    if(poll().log()) return post().reply("Logged!");
    if(!c) post().reply(Canned.blurbs.error)
    if(c == "help"){
      post()
        .reply(Ixns.dm.all.concat( m.sender == "instructor" ? Ixns.dm.instructors : []).join("\n\n"))
        .reply(Ixns.group.all.concat( m.sender == "instructor" ? Ixns.group.instructors : []).join("\n\n"));
    }
    else if(c == "anon") post().anon();
    else if(c == "remindme") reminder().create();
    else if(c == "stopreminder") reminder().stop();
    else if(m.sender == "instructor"){
      if(c == "refresh") post().refreshGroups();
      else if(c == "edit") post().edit();
      else if(c == "delete") post().delete();
    }
  }
}

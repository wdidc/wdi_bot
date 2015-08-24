var SlackAPI = require("./SlackAPI");
var h = require("./helperMethods");

module.exports = function(){
  var channel, onStop;

  function create(_channel, onStart, _onStop){
    channel = _channel;
    onStop = _onStop;
    global.bot.poll.inProgress = true;
    SlackAPI.get("groups.info",
      {channel: channel},
      function(response){
        members = response.group.members;
        global.bot.poll.channel = channel;
        global.bot.poll.members = members;
        sendToMembers(onStart);
        setTimeout(pollStop, 10 * 1000);
      }
    );
  }

  function tally(){
    var r, n, set = [], min = 0, max = 5;
    var rs = global.bot.poll.responses;
    var tally, q = rs.length, output = [];
    var aType, quantities = [], data = [];
    for(r = 0; r < q; r++){
      n = Number.parseInt(rs[r])
      if(!isNaN(n) && n >= min && n <= max) set.push(Math.round(n));
    }
    tally = h.tally(set);
    console.log(tally);
    for(n = min; n <= max; n++) output.push(n + " => " + (tally.quantities[n] || 0));
    for(aType in tally.data) data.push(aType + " " + tally.data[aType]);
    output.push("Total " + set.length + ", " + data.join(", "));
    return output.join("\n");
  }

  function sendToMembers(callback){
    h.each(members, function(member){
      SlackAPI.get("im.open",
        {user: member},
        function(chat){
          var dm = chat.channel.id;
          callback(dm);
        }
      )
    });
  }

  function log(user, response){
    console.log(user, response);
    var memberID = global.bot.poll.members.indexOf(user);
    if(memberID < 0) return false;
    global.bot.poll.responses.push(response);
    delete global.bot.poll.members[memberID];
    return true;
  }

  function pollStop(){
    onStop(global.bot.poll.channel, tally());
    global.bot.poll.channel = "";
    global.bot.poll.inProgress = false;
    global.bot.poll.members = [];
    global.bot.poll.responses = [];
  }

  return{
    create : create,
    log: log
  }

}()
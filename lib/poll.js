respondWith.poll.log = function(){
  var memberID = global.bot.poll.members.indexOf(message.user);
  //if(memberID < 0) return false;
  global.bot.poll.responses.push(message.text[0]);
  //delete global.bot.poll.members[memberID];
  return true;
}
respondWith.poll.tally = function(){
  var r, n, set = [], min = 0, max = 5;
  var rs = global.bot.poll.responses;
  var tally, q = rs.length, output = [];
  var aType, quantities = [], data = [];
  for(r = 0; r < q; r++){
    n = Number.parseInt(rs[r])
    if(!isNaN(n) && n >= min && n <= max) set.push(Math.round(n));
  }
  tally = h.tally(set);
  output.push("Question: " + message.text);
  for(n = min; n <= max; n++) output.push(n + " => " + (tally.quantities[n] || 0));
  for(aType in tally.data) data.push(aType + " " + tally.data[aType]);
  output.push("Total " + set.length + ", " + data.join(", "));
  return output.join("\n");
}
respondWith.poll.stop = function(){
  send(global.bot.poll.channel, respondWith.poll.tally());
  global.bot.poll.channel = "";
  global.bot.poll.inProgress = false;
  global.bot.poll.members = [];
  global.bot.poll.responses = [];
}
respondWith.poll.new = function(){
  var members;
  function iterateOverMembers(callback){
    for(m = 0; m < members.length; m++){
      SlackAPI.get("im.open",
        {user: members[m]},
        sendPoll
      );
    }
  }
  function sendPoll(chat){
    var channel = chat.channel.id;
    send(channel, "You've been asked a question:\n-----\n" + message.text + "\n-----\nPlease respond to me with a number between 0 and 5 within the next 7 seconds.");
  }
  SlackAPI.get("groups.info",
    {channel: message.channel},
    function(response){
      members = response.group.members;
      global.bot.poll.channel = message.channel;
      global.bot.poll.inProgress = true;
      global.bot.poll.members = members;
      iterateOverMembers(sendPoll);
      setTimeout(respondWith.poll.stop, 10 * 1000);
    }
  );
}

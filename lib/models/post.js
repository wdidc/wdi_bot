var SlackAPI = require("../SlackAPI");
var h        = require("../helper");

module.exports = {
  send: function(channel, text, callback){
    SlackAPI.get("chat.postMessage", {
        channel: channel,
        as_user: true,
        text: h.backtics(text)
      },
      callback
    );
  },
  edit: function(channel, timestamp, text){
    SlackAPI.get("chat.update", {
      channel: channel,
      ts: timestamp,
      text: text
    });
  },
  destroy: function(channel, timestamp){
    SlackAPI.get("chat.delete", {
      channel: channel,
      ts: timestamp
    });
  },
  openIM: function(memberID, callback){
    SlackAPI.get("im.open",
      {user: memberID},
      function(chat){
        var dm = chat.channel.id;
        if(callback) callback(dm);
      }
    )
  },
  toEachMemberOf: function(channel, callback){
    var self = this;
    SlackAPI.get("groups.info",
      {channel: channel},
      function(response){
        h.each(response.group.members, function(memberID){
          self.openIM(memberID, callback);
        });
      }
    );
  },
  refreshGroups: SlackAPI.refreshGroups.bind(SlackAPI)
}

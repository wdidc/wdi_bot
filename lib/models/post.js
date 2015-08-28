"use strict";

var SlackAPI = require("../SlackAPI");

module.exports = {
  send: function(channel, text, callback){
    SlackAPI.get("chat.postMessage", {
        channel: channel,
        as_user: true,
        text: text
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
  refreshGroups: SlackAPI.refreshGroups.bind(SlackAPI)
}

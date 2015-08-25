function send(channel, text, callback){
  SlackAPI.get("chat.postMessage", {
      channel: channel,
      as_user: true,
      text: h.backtics(text || message.text)
    },
    callback || null
  );
}

function update(){
  SlackAPI.get("chat.update", {
    channel: env.public_group_id,
    ts: message.arguments[0],
    text: h.backtics(message.text)
  });
}

function destroy(){
  SlackAPI.get("chat.delete", {
    channel: env.public_group_id,
    ts: message.arguments[0]
  });
}

respondWith.postIn = {
  public : function(text, callback){
    send(env.public_group_id, text, callback);
  },
  private : function(text){
    var output = [
      "usr:" + message.username,
      "cmd:" + (message.command ? message.command : "nil"),
      "arg:" + (message.arguments.length > 0 ? message.arguments.join(",") : "nil")
    ].join(", ") + "\n" + (text || message.text);

    send(env.private_group_id, output);
  }
}

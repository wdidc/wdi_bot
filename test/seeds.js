var env = require("../env")

module.exports = [
  // regular message
  {"type":"message","channel":"G08LT3JQ4","user":"U03PX5UA0","text":"this is any old message","ts":"1438805579.000011","team":"T0351JZQ0"},

  // mention from someone else in a group
  {"type":"message","channel":"G08LT3JQ4","user":"U03PX5UA0","text":"this mentions <@" + env.bot_id + ">","ts":"1438805588.000012","team":"T0351JZQ0"},

  // mention from someone else in the public group
  {"type":"message","channel": env.public_group_id, "user":"U03PX5UA0", "text":"this mentions <@" + env.bot_id + ">","ts":"1438805588.000012","team":"T0351JZQ0"},

  // mention from itself in the public group
  {"type":"message","channel": env.public_group_id, "user": env.bot_id, "text":"this mentions <@" + env.bot_id + ">","ts":"1438805588.000012","team":"T0351JZQ0"},

  // mention from someone else in the private group
  {"type":"message","channel": env.private_group_id, "user":"U03PX5UA0", "text":"asdf this mentions <@" + env.bot_id + ">","ts":"1438805588.000012","team":"T0351JZQ0"},

  // mention from itself in the private group
  {"type":"message","channel": env.private_group_id, "user": env.bot_id, "text":"this mentions <@" + env.bot_id + ">","ts":"1438805588.000012","team":"T0351JZQ0"},

  // direct message
  {"type":"message","channel":"D08LU1H32","user":"U03PX5UA0","text":"this is a private message","ts":"1438805598.000003","team":"T0351JZQ0"},

  // user typing
  {"type": 'user_typing', "channel": 'D08M4TWMC', "user": 'U03PX5UA0'}
]

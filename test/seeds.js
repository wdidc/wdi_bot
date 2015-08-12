var env = require("../env")

module.exports = {
  any_message: {
      "channel": "G08LT3JQ4",
      "team": "T0351JZQ0",
      "text": "Any old message",
      "ts": "1438805579.000011",
      "type": "message",
      "user": "U03PX5UA0"
  },
  any_mention: {
      "channel": "G08LT3JQ4",
      "team": "T0351JZQ0",
      "text": "Message from any room mentioning <@" + env.bot_id + ">",
      "ts": "1438805588.000012",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pvt_mention: {
      "channel": env.private_group_id,
      "team": "T0351JZQ0",
      "text": "Mentioning <@" + env.bot_id + ">",
      "ts": "1438805588.000012",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pub_mention: {
      "channel": env.public_group_id,
      "team": "T0351JZQ0",
      "text": "Mentioning <@" + env.bot_id + ">",
      "ts": "1438805588.000012",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pvt_mention_self: {
      "channel": env.private_group_id,
      "team": "T0351JZQ0",
      "text": "Mentioning <@" + env.bot_id + ">",
      "ts": "1438805588.000012",
      "type": "message",
      "user": env.bot_id
  },
  pub_mention_self: {
      "channel": env.public_group_id,
      "team": "T0351JZQ0",
      "text": "Mentioning <@" + env.bot_id + ">",
      "ts": "1438805588.000012",
      "type": "message",
      "user": env.bot_id
  },
  student_dm: {
      "channel": "D08LU1H32",
      "team": "T0351JZQ0",
      "text": "Direct message",
      "ts": "1438805598.000003",
      "type": "message",
      "user": "U12345678"
  },
  instructor_dm: {
      "channel": "D08LU1H32",
      "team": "T0351JZQ0",
      "text": "Direct message",
      "ts": "1438805598.000003",
      "type": "message",
      "user": "U03PX5UA0"
  },
  user_typing: {
      "channel": "D08M4TWMC",
      "type": "user_typing",
      "user": "U03PX5UA0"
  },
  pub_join: {
      "channel": env.public_group_id,
      "inviter": "U03LQC301",
      "subtype": "group_join",
      "text": "<@U03PX5UA0|jshawl> has joined the group",
      "ts": "1439327141.000028",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pub_leave: {
      "channel": env.public_group_id,
      "subtype": "group_leave",
      "text": "<@U03PX5UA0|jshawl> has left the group",
      "ts": "1439327131.000026",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pvt_join: {
      "channel": env.private_group_id,
      "inviter": "U03LQC301",
      "subtype": "group_join",
      "text": "<@U03PX5UA0|jshawl> has joined the group",
      "ts": "1439327141.000028",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pvt_leave: {
      "channel": env.private_group_id,
      "subtype": "group_leave",
      "text": "<@U03PX5UA0|jshawl> has left the group",
      "ts": "1439327131.000026",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pub_edit: {
      "channel": env.public_group_id,
      "event_ts": "1439327299.704655",
      "hidden": true,
      "message": {
          "type": "message",
          "user": "U03LQC301",
          "text": "Text has been edited.",
          "edited": {
              "user": "U03LQC301",
              "ts": "1439327299.000000"
          },
          "ts": "1439327293.000030"
      },
      "subtype": "message_changed",
      "ts": "1439327299.000031",
      "type": "message"
  },
  pub_delete: {
      "channel": env.public_group_id,
      "deleted_ts": "1439327293.000030",
      "event_ts": "1439327302.704714",
      "hidden": true,
      "subtype": "message_deleted",
      "ts": "1439327302.000032",
      "type": "message"
  },
  pvt_edit: {
      "channel": env.private_group_id,
      "event_ts": "1439327299.704655",
      "hidden": true,
      "message": {
          "type": "message",
          "user": "U03LQC301",
          "text": "Text has been edited.",
          "edited": {
              "user": "U03LQC301",
              "ts": "1439327299.000000"
          },
          "ts": "1439327293.000030"
      },
      "subtype": "message_changed",
      "ts": "1439327299.000031",
      "type": "message"
  },
  pvt_delete: {
      "channel": env.private_group_id,
      "deleted_ts": "1439327293.000030",
      "event_ts": "1439327302.704714",
      "hidden": true,
      "subtype": "message_deleted",
      "ts": "1439327302.000032",
      "type": "message"
  },
  pvt_command_edit: {
      "channel": env.private_group_id,
      "event_ts": "1439327299.704655",
      "hidden": true,
      "message": {
          "type": "message",
          "user": "U03LQC301",
          "text": "Text has been edited.",
          "edited": {
              "user": "U03LQC301",
              "ts": "1439327299.000000"
          },
          "ts": "1439327293.000030"
      },
      "subtype": "message_changed",
      "ts": "1439327299.000031",
      "type": "message"
  },
  pvt_command_delete: {
      "channel": env.private_group_id,
      "deleted_ts": "1439327293.000030",
      "event_ts": "1439327302.704714",
      "hidden": true,
      "subtype": "message_deleted",
      "ts": "1439327302.000032",
      "type": "message"
  },
  dm_edit: {
      "channel": "D08N58D6G",
      "event_ts": "1439329340.765783",
      "hidden": true,
      "message": {
          "type": "message",
          "user": "U03LQC301",
          "text": "DM text has been edited.",
          "edited": {
              "user": "U03LQC301",
              "ts": "1439329340.000000"
          },
          "ts": "1439329333.000040"
      },
      "subtype": "message_changed",
      "ts": "1439329340.000041",
      "type": "message"
  },
  dm_delete: {
      "channel": "D08N58D6G",
      "deleted_ts": "1439329333.000040",
      "event_ts": "1439329343.765858",
      "hidden": true,
      "subtype": "message_deleted",
      "ts": "1439329343.000042",
      "type": "message"
  },
  groups_info: {
    "ok": true,
    "group": {
        "id": "G08PVAVSS",
        "name": "wdi_bot_test_private",
        "is_group": true,
        "created": 1438962085,
        "creator": "U03LQC301",
        "is_archived": false,
        "is_open": true,
        "last_read": "1438962106.000003",
        "latest": {
            "type": "message",
            "user": "U03LQC301",
            "text": "<@U08N52D9A>: !!{refresh}!!",
            "ts": "1439336143.000085"
        },
        "unread_count": 104,
        "unread_count_display": 70,
        "members": [
            "U03LQC301",
            "U03PX5UA0",
            "U08N52D9A",
            "U08NE835M"
        ],
        "topic": {
            "value": "",
            "creator": "",
            "last_set": 0
        },
        "purpose": {
            "value": "",
            "creator": "",
            "last_set": 0
        }
    }
  },
  pvt_mention_long: {
      "channel": env.privte_group_id,
      "team": "T0351JZQ0",
      "text": "text": "<@U08NE835M>: <!group> For those of you interested, here are some UX book recommendations from Kara.\n\nDon\u2019t make me think, Revisited \n<http:\/\/www.amazon.com\/gp\/product\/0321965515\/ref=pd_lpo_sbs_dp_ss_1?pf_rd_p=1944687622&amp;pf_rd_s=lpo-top-stripe-1&amp;pf_rd_t=201&amp;pf_rd_i=0789723107&amp;pf_rd_m=ATVPDKIKX0DER&amp;pf_rd_r=1HP8FGN2DVT77B8M2JYW>\n\nBadass: making users awesome\n<http:\/\/www.amazon.com\/Badass-Making-Awesome-Kathy-Sierra\/dp\/1491919019>\n\ninformation architecture for the world wide web, 2nd ed\n<http:\/\/www.amazon.com\/Information-Architecture-World-Wide-Web\/dp\/0596000359>\n\njust enough research\n<http:\/\/abookapart.com\/products\/just-enough-research>",
      "ts": "1438805588.000012",
      "type": "message",
      "user": "U03PX5UA0"
  },
  pvt_group_info: {
  "ok": true,
  "group": {
      "id": "G08PVAVSS",
      "name": "wdi_bot_test_private",
      "is_group": true,
      "created": 1438962085,
      "creator": "U03LQC301",
      "is_archived": false,
      "is_open": true,
      "last_read": "1439340798.000118",
      "latest": {
          "text": "Testing with Mocha",
          "username": "bot",
          "type": "message",
          "subtype": "bot_message",
          "ts": "1439340798.000118"
      },
      "unread_count": 0,
      "unread_count_display": 0,
      "members": [
          "U03LQC301",
          "U03PX5UA0",
          "U08N52D9A",
          "U08NE835M"
      ],
      "topic": {
          "value": "",
          "creator": "",
          "last_set": 0
      },
      "purpose": {
          "value": "",
          "creator": "",
          "last_set": 0
      }
  }
}

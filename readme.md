# AnonBot

![](https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2015-08-05/8710972370_d14a3c695cb69fe2ed3e_72.jpg)

## Local Setup
```
$ git clone git@github.com:wdidc/anonbot
$ cd anonbot
$ npm install
```

### Get Slack API Token

Visit https://ga-students.slack.com/services/new/bot and create a new bot integration.

Copy the API token.

Create a file named `env.js` in the root of the project:

```js
// env.js

module.exports = {
  token: "###",
  bot_id: "###",
  private_group_id: "###", // The group from which those authorized may @mention the bot
  public_group_id: "###" // The main group to which the bot will be posting
}

```
```
$ node app.js
```

## User

When anyone DMs the bot, it will repost the response to the public group headed with the text `[Student]`, and to the private group headed with `[MESSAGER'S_USERNAME]`.

When anyone @mentions the bot from the "private group", it will send the response to the public group headed with the text `[Instructor]`. Presumably, anyone in the private group will be "authorized" to use the bot.

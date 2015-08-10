# WDI_Bot

![](https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2015-08-05/8710972370_d14a3c695cb69fe2ed3e_72.jpg)

## Local Setup
```
$ git clone git@github.com:wdidc/wdi_bot
$ cd wdi_bot
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

## Posting

When anyone DMs the bot, it will repost the response to the public group headed with the text `[Student]`, and to the private group headed with `[MESSAGER'S_USERNAME]`.

When anyone @mentions the bot from the "private group", it will send the response to the public group headed with the text `[Instructor]`. Presumably, anyone in the private group will be "authorized" to use the bot.

## Editing

In the private room, @mention the bot like so:
```
@bots_name !!{edit 1439176878000016}!! This post should now be edited.
```
The number is the timestamp of the original message, which can be obtained by clicking the little o'clock number to the left of the message. This takes you to a URL like the following:

https://slack_team.slack.com/archives/bot_test/p1439176878000016

Simply copy the timestamp from the end, excluding the leading `p`.

The text following the `!!{...}!!` is what will replace the original text.

## Deleting

Same as editing, but with the word `delete` instead of `edit`, and the text following the `!!{...}!!` has no effect.

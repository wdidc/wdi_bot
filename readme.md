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
  token: "###", // The bot's API token
  bot_id: "###", // The bot's user ID
  private_group_id: "###", // The group from which those authorized may @mention the bot
  public_group_id: "###" // The main group to which the bot will be posting
}

```
```
$ node app.js
```

## Posting

When anyone DMs the bot, it will check to see whether that person is a student or instructor by comparing their user ID against the IDs of those in the "private" group.

If the user is a student, it will repost the response to the public group headed with the text `[Student]`, and to the private group headed with `[MESSAGER'S_USERNAME]`.

When anyone @mentions the bot from the "private group", it will send the response to the public group headed with the text `[Instructor]`. (Presumably, anyone in the private group will be "authorized" to use the bot.)

## Commands

In the private room, @mention the bot with a command inside `!!{ }!!`.

### edit

Examples: 
```
@test_wdi_bot: !!{edit 1439338127000074}

@test_wdi_bot: !!{edit https://ga-students.slack.com/archives/wdi_bot_test_public/p1439338127000074}!! This has been edited again.
```

The second value contains the timestamp of the post *when it was made inside the **public** group*.

It can be obtained by going into the public group, right-clicking the time o'clock to the left of the message, and selecting "copy link".

The text following the `!!{...}!!` is what will replace the original text.

### delete

Same as editing, but with the word `delete` instead of `edit`, and the text following the `!!{...}!!` has no effect.

### refresh
```
@test_wdi_bot: !!{refresh}!!
```

This makes the bot refresh its list of which users are a part of the private group. It runs automatically whenever a user joins or leaves the private group.

## Testing

```
npm -g install mocha
mocha -b
```

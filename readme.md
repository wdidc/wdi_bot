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

## Testing

```
npm -g install mocha
mocha -b
```

## Deployment

Commit your changes to master, then push to the production git repo (on wdidc.org).  The post_commit hook will automatically utilize your changes and they should be available on production shortly.
```
git remote add production git@git.wdidc.org:wdidc_bot.git
git checkout master
git push production master
```

## Commands

The bot checks whether a person is a student or instructor by comparing their user ID against the IDs of those in the "private" group.

```txt
***Group / Channel Commands***

@instructors [message]
I send a *not* anonymous *private* message to each of the instructors.

Allreminders:
I show all reminders I'm scheduled to post to the group.

---Instructors Only---

Remindme */5_*_*_*_*_*: [message]
I post your message to th egroup according to the given Cron schedule. See how to write Crons here: http://crontab-generator.org . Instead of 5 fields, I accept 6, beginning with seconds. The example here means 'every 5 seconds'.

Stopreminder [id]:
I stop the reminder with the given ID.

Pollme: [question]
I relay your question as a DM to all members of the group, asking for them to respond with a number between 0 and 5 within 10 seconds. Then I display the results to the group.
```
```txt
***Group / Channel Commands***

@instructors [message]
I send a *not* anonymous *private* message to each of the instructors.

Allreminders:
I show all reminders I'm scheduled to post to the group.

---Instructors Only---

Remindme */5_*_*_*_*_*: [message]
I post your message to th egroup according to the given Cron schedule. See how to write Crons here: http://crontab-generator.org . Instead of 5 fields, I accept 6, beginning with seconds. The example here means 'every 5 seconds'.

Stopreminder [id]:
I stop the reminder with the given ID.

Pollme: [question]
I relay your question as a DM to all members of the group, asking for them to respond with a number between 0 and 5.

Pollstop:
I close the poll and display the results to the group.
```

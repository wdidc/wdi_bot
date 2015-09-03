var Sequelize = require("sequelize");
var SQLite    = require("sqlite3");
var db_connection = new Sequelize("wdi_bot", null, null, {
  dialect: "sqlite",
  connection: new SQLite.Database(__dirname + "/db.sqlite"),
  storage: __dirname + "/db.sqlite"
});

var Reminder = db_connection.define("reminder", {
  channel: Sequelize.STRING,
  cron: Sequelize.STRING,
  text: Sequelize.TEXT
});

module.exports = {
  Sequelize: Sequelize,
  connection: db_connection,
  models: {
    Reminder: Reminder
  }
}

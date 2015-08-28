var Sequelize = require("sequelize");
var SQLite    = require("sqlite3");
var db_connection = new Sequelize("wdi_bot", null, null, {
  dialect: "sqlite",
  connection: new SQLite.Database("db/db.sqlite"),
  storage: "db/db.sqlite"
});

var Reminder = db_connection.define("reminder", {
  userId: Sequelize.STRING,
  active: Sequelize.BOOLEAN,
  content: Sequelize.TEXT
});

module.exports = {
  Sequelize: Sequelize,
  connection: db_connection,
  models: {
    reminder: Reminder
  }
}

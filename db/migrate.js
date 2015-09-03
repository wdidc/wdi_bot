var db = require("./connection");

db.connection.sync({force: true}).then(function(){
  process.exit();
});

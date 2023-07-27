let {app} = require('electron');
let messages = require('./messages')
let path = require('path');
let filename = path.join(app.getPath('userData'),
    'db.db');
let db = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {filename},
  timezone: 'UTC',
  dateStrings: true
});
let start = async () => {
  let startTime = Date.now();
  for (let i = 0; i < 100; i++) {
    let index = i % 2;
    await db('message').insert(messages[index]);
  }
  let endTime = Date.now();
  console.log(endTime - startTime);
}
module.exports = {
  start
}
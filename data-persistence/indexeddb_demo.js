let Dexie = require('Dexie');
const db = new Dexie('db');
db.version(1).stores({
  message: '++, message_from, message_to, msg, create_time'
});

window.onload = async () => {
  let startTime = Date.now();
  for (let i = 0; i < 100; i++) {
    let index = i % 2;
    await db.message.add(messages[index]);
  }
  let endTime = Date.now();
  console.log(endTime - startTime);
}
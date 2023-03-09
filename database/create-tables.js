const db = require('./index');

db.prepare(`
    CREATE TABLE users (
      discord_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      token TEXT,
      country TEXT NOT NULL
    )
`).run();

console.log('tablas creadas');
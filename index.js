const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || '';

app.get('/', async (req, res) => {
  let dbStatus = 'NO DATABASE_URL configured';
  if (DATABASE_URL) {
    try {
      const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false } // requerido para DO managed DB
      });
      await client.connect();
      const now = await client.query('SELECT NOW()');
      await client.end();
      dbStatus = `DB OK: ${now.rows[0].now}`;
    } catch (err) {
      dbStatus = `DB ERROR: ${err.message}`;
    }
  }
  res.send(`<pre>CaptapropIA - OK\nPORT: ${port}\n${dbStatus}</pre>`);
});

app.listen(port, () => console.log(`App listening on ${port}`));

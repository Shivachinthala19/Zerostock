const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.get("SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='suppliers'", (err, row) => {
            if (err) {
                console.error(err);
            } else if (row.count === 0) {
                const schema = fs.readFileSync(schemaPath, 'utf8');
                db.exec(schema, (err) => {
                    if (err) console.error("Could not run schema setup", err);
                    else console.log("Database schema applied.");
                });
            }
        });
    }
});

module.exports = db;

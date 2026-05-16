import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function runMigrations(): void {
  const db = getDb();

  // Create migrations tracking table
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Look for migration .sql files in several locations:
  //   1. next to this file (dist/db/migrations when the Dockerfile copies them)
  //   2. the source tree (server/src/db/migrations) — for local `node dist/...`
  //      runs where SQL files weren't copied next to the compiled output
  //   3. tsx/dev mode where __dirname is already the source dir
  const candidates = [
    path.join(__dirname, 'migrations'),
    path.resolve(__dirname, '../../src/db/migrations'),
    path.resolve(__dirname, '../../../src/db/migrations'),
  ];
  const migrationsDir = candidates.find(p => fs.existsSync(p));
  if (!migrationsDir) {
    console.warn('No migrations directory found; skipping migrations.');
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const [row] = db.exec(
      `SELECT name FROM _migrations WHERE name = $name`,
      { $name: file },
    );
    if (row && row.values.length > 0) continue;

    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    db.run(sql);
    db.run(`INSERT INTO _migrations (name) VALUES ($name)`, { $name: file });
  }
}

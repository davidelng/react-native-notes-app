export const queries = new Map<string, string>();

queries.set(
  `createTableNotes`,
  `CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL, 
    content TEXT NULL, 
    tag INTEGER NULL, 
    pinned INTEGER DEFAULT 0 CHECK (pinned IN (0, 1)), 
    date_add TEXT DEFAULT datetime(CURRENT_TIMESTAMP, "localtime") NOT NULL, 
    date_upd TEXT DEFAULT datetime(CURRENT_TIMESTAMP, "localtime") NOT NULL
  )`
);

queries.set(
  `createTableTags`,
  `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    color TEXT NOT NULL, 
    date_add TEXT DEFAULT datetime(CURRENT_TIMESTAMP, "localtime") NOT NULL, 
    date_upd TEXT DEFAULT datetime(CURRENT_TIMESTAMP, "localtime") NOT NULL
  )`
);

queries.set(
  `getAllNotes`,
  `SELECT 
    n.id, n.title, n.content, n.pinned, n.date_upd as timestamp, 
    t.name as tag, t.color as tag_color 
    FROM notes n 
    LEFT JOIN tags t ON n.tag = t.id
    ORDER BY timestamp DESC`
);

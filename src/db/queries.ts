export const queries = new Map<string, string>();

// NOTES

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
  `getAllNotes`,
  `SELECT 
    n.id, n.title, n.content, n.pinned, n.date_upd as timestamp, 
    t.name as tag, t.color as tagColor, t.id as tagId  
    FROM notes n 
    LEFT JOIN tags t ON n.tag = t.id
    ORDER BY timestamp`
);

queries.set(
  `getNotesByTag`,
  `SELECT 
    n.id, n.title, n.content, n.pinned, n.date_upd as timestamp, 
    t.name as tag, t.color as tagColor, t.id as tagId
    FROM notes n 
    LEFT JOIN tags t ON n.tag = t.id
    WHERE tag = ?
    ORDER BY timestamp DESC`
);

queries.set(
  `insertNote`,
  `INSERT INTO notes
    (title, content, pinned, date_upd, tag) 
    VALUES (?, ?, ?, datetime(CURRENT_TIMESTAMP, "localtime"), ?)`
);

queries.set(
  `updateNote`,
  `UPDATE notes
    SET title = ?, content = ?, pinned = ?, date_upd = datetime(CURRENT_TIMESTAMP, "localtime"), tag = ?
    WHERE id = ?`
);

queries.set(`deleteNote`, `DELETE FROM notes WHERE id = ?`);

queries.set(`pinNote`, `UPDATE notes SET pinned = 1 WHERE id = ?`);

queries.set(`unpinNote`, `UPDATE notes SET pinned = 0 WHERE id = ?`);

// TAGS

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

queries.set(`getAllTags`, `SELECT id, name, color FROM tags`);

queries.set(
  `insertTag`,
  `INSERT INTO tags
    (name, color) 
    VALUES (?, ?)`
);

queries.set(
  `updateTag`,
  `UPDATE tags
    SET name = ?, color = ?, date_upd = datetime(CURRENT_TIMESTAMP, "localtime")
    WHERE id = ?`
);

queries.set(`deleteTag`, `DELETE FROM tags  WHERE id = ?`);

// CONFIGURATION

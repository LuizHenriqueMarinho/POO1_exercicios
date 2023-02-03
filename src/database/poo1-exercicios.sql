-- Active: 1675367891807@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,    
    length_s REAL NOT NULL,    
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

DROP TABLE videos;
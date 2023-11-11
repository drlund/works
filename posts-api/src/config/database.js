const md5 = require('md5');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');


const USERS_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)
`;

const DROP_USERS_SCHEMA = `
	DROP TABLE IF EXISTS users;
`;

const INSERT_USER = `
    INSERT OR IGNORE INTO users (
        name,
        email,
        password
    ) VALUES (?, ?, ?)
`;

const POSTS_SCHEMA = `
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		content TEXT,
		imageUrl TEXT
	)
`;

const DROP_POSTS_SCHEMA = `
	DROP TABLE IF EXISTS posts;
`;

const INSERT_POST = `
    INSERT OR IGNORE INTO posts (
        title,
		content,
		imageUrl
    ) VALUES (?, ?, ?)
`;


db.serialize(async () => {
	db.run('PRAGMA foreign_keys=ON');
	db.run(DROP_USERS_SCHEMA);
	db.run(USERS_SCHEMA);
	db.run(INSERT_USER, ['Admin', 'admin@fiap.com.br', md5('123456')]);
	db.run(DROP_POSTS_SCHEMA);
	db.run(POSTS_SCHEMA);

	try {
		db.run(INSERT_POST, [
			"Primeiro Post",
			"Este é o conteúdo do primeiro post, este texto é o conteúdo.",
			"https://s2.glbimg.com/fP8FcBdhKXgZ2HCLdGl7R8MIHIk=/e.glbimg.com/og/ed/f/original/2017/10/20/rick-and-morty3.png"
		]);
	} catch (e) {
		console.log(`Error: ${e}`);
	}

	db.each('SELECT * FROM posts', (err, contact) => {
		console.log(`Posts: ${JSON.stringify(contact)}`);
	});
});

process.on('SIGINT', () =>
	db.close(() => {
		console.log('DB closed');
		process.exit(0);
	})
);

module.exports = db;

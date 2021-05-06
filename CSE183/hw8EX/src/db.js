const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

exports.selectBooks = async (author) => {
  let select = 'SELECT book FROM book';
  if (author) {
    select += ` WHERE book->>'author' ~* $1`
  }
  const query = {
    text: select,
    values: author ? [ `${author}` ] : [ ]
  };
  const { rows } = await pool.query(query);
  const books = [];
  for (const row of rows) {
    books.push(row.book);
  }
  return books;
}

exports.selectBook = async (isbn) => {
  const select = 'SELECT book FROM book WHERE isbn = $1';
  const query = {
    text: select,
    values: [ isbn ]
  };
  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0].book : undefined;
}

exports.insertBook = async (book) => {
  const insert = 'INSERT INTO book(isbn, book) VALUES ($1, $2)';
  const query = {
    text: insert,
    values: [ book.isbn, book ]
  };
  await pool.query(query);
}


console.log(`Connected to database '${process.env.POSTGRES_DB}'`)
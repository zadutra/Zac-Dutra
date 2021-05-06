const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.getFunc = async (mailbox) => {
  let select = 'SELECT * FROM mail WHERE mailbox = $1';
  const query = {
    text: select,
    values: [mailbox],
  };
  const {rows} = await pool.query(query);
  const email = [];
  for (const row of rows){
    email.push(row.mail);
  }
  return email;
};

exports.selectMail = async (id) => {
  const select = 'SELECT mail FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? rows[0].email : undefined;
};

exports.insertMail = async (email) => {
  const insert = 'INSERT INTO mail(id, mailbox, mail) VALUES ($1, $2, $3)';
  const query = {
    text: insert,
    values: [email.id, email.mailbox, email],
  };
  await pool.query(query);
};


console.log(`Connected to database '${process.env.POSTGRES_DB}'`);


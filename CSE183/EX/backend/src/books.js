const books = require('../data/books.json');

exports.getAll = async (req, res) => {
  res.status(200).json(books);
}

exports.getByISBN = async (req, res) => {
  const book = books.find(book => book.isbn == req.params.isbn);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send();
  }
} 

exports.post = async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.sendStatus(403);
  }
  const book = books.find(book => book.isbn == req.body.isbn);
  if (book) {
    res.status(409).send();
  } else {
    books.push(req.body);
    res.status(201).send(req.body);
  }
}


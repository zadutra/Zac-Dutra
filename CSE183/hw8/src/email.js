const db = require('./db');

exports.getAll = async (req, res) => {
  const emails = await db.selectAllMail(req.query.mailbox);
  res.status(200).json(emails);
};

exports.getByID = async (req, res) => {
  const email = await db.selectMail(req.params.id);
  if (email) {
    res.status(200).json(email);
  } else {
    res.status(404).send();
  }
};

exports.post = async (req, res) => {
  if ( req.body['id'] != undefined || req.body['from-email'] != undefined ||
   req.body['from-name'] != undefined) {
    res.status(400).send();
  }
  await db.insertMail(createUUID(), 'sent', req.body);
  res.status(201).send(req.body);
};

// I got this function from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
/**
 * This is a function.
 *
 * @return {string} A UUID
 *
 */
function createUUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
  return uuid;
}


const inbox = require('../data/inbox.json');
const trash = require('../data/trash.json');
const sent = require('../data/sent.json');

const emails = [{'name': 'inbox', 'mail': inbox},
  {'name': 'trash', 'mail': trash},
  {'name': 'sent', 'mail': sent}];

exports.getFunc = async (req, res) => {
  const temp1 = [];
  const temp2 = [];
  const temp3 = [];
  let item = [];
  if (req.query.mailbox == 'inbox') {
    for (let i = 0; i < inbox.length; i++) {
      temp1[i] = inbox[i];
      delete temp1[i]['content'];
    }
    item = [{'name': 'inbox', 'mail': temp1}];
    res.status(200).send(item);
  } else if (req.query.mailbox == 'sent') {
    for (let i = 0; i < sent.length; i++) {
      temp1[i] = sent[i];
      delete temp1[i]['content'];
    }
    item = [{'name': 'sent', 'mail': temp1}];
    res.status(200).send(item);
  } else if (req.query.mailbox == 'trash') {
    for (let i = 0; i < trash.length; i++) {
      temp1[i] = trash[i];
      delete temp1[i]['content'];
    }
    item = [{'name': 'trash', 'mail': temp1}];
    res.status(200).send(item);
  } else if (req.query.mailbox == undefined) {
    for (let i = 0; i < inbox.length; i++) {
      temp1[i] = inbox[i];
      delete temp1[i]['content'];
    }
    for (let i = 0; i < sent.length; i++) {
      temp2[i] = sent[i];
      delete temp2[i]['content'];
    }
    for (let i = 0; i < trash.length; i++) {
      temp3[i] = trash[i];
      delete temp3[i]['content'];
    }
    item = [{'name': 'inbox', 'mail': temp1}, {'name': 'sent', 'mail': temp2},
      {'name': 'trash', 'mail': temp3}];
    res.status(200).send(item);
  } else {
    res.status(404).send();
  }
  res.status(400).send();
};

exports.getByID = async (req, res) => {
  let temp = [];
  let email = [];
  for (let i = 0; i < inbox.length; i++) {
    temp = inbox[i]['id'];
    if (temp == req.params.id) {
      email = inbox[i];
      res.status(200).json(email);
    }
  }
  for (let i = 0; i < sent.length; i++) {
    temp = sent[i].id;
    if (temp == req.params.id) {
      email = sent[i];
      res.status(200).json(email);
    }
  }
  for (let i = 0; i < trash.length; i++) {
    temp = trash[i].id;
    if (temp == req.params.id) {
      email = trash[i];
      res.status(200).json(email);
    }
  }
  res.status(404).send();
};

exports.post = async (req, res) => {
  if ( req.body['id'] != undefined || req.body['from-email'] != undefined ||
   req.body['from-name'] != undefined) {
    res.status(400).send();
  }
  const result = JSON.parse(JSON.stringify(req.body));
  result['id'] = createUuid();
  result['from-email'] = 'CSE183 Student';
  result['from-name'] = 'cse183student@ucsc.edu';
  sent.push(result);
  res.status(201).send(result);
};

exports.put = async (req, res) => {
  let temp = [];
  let email = [];
  let box = [];
  if (req.query.mailbox == undefined) {
    res.status(404).send();
  } else {
    box = emails.find( ({name}) => name == req.query.mailbox);
    if (box == undefined) {
      console.log('in undefined check');
      box = {'name': req.query.mailbox, 'mail': []};
    }
  }
  for (let i = 0; i < inbox.length; i++) {
    temp = inbox[i];
    if (temp['id'] == req.params.id) {
      email = temp;
      delete inbox[i];
      if (box['name'] == 'sent') {
        check = sent.find( function(element) {
          return element == temp['id'];
        });
        if (check == undefined) {
          res.status(409).send();
          break;
        }
      }
      box['mail'].push(email);
      res.status(204).send();
    }
  }
  for (let i = 0; i < sent.length; i++) {
    temp = sent[i];
    if (temp['id'] == req.params.id) {
      email = temp;
      if (box['name'] == 'sent') {
        res.status(204).send();
      }
      delete sent[i];
      box['mail'].push(email);
      res.status(204).send();
    }
  }
  for (let i = 0; i < trash.length; i++) {
    temp = trash[i];
    if (temp['id'] == req.params.id) {
      email = temp;
      if (box['name'] == 'sent') {
        check = sent.find( function(element) {
          return element = temp['id'];
        });
        if (check == undefined) {
          res.status(409).send();
          break;
        }
      }
      delete trash[i];
      box['mail'].push(email);
      res.status(204).send();
    }
  }
  res.status(404).send();
};
// I got this function from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
/**
 * This is a function.
 *
 * @return {string} A UUID
 *
 */
function createUuid() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
  return uuid;
}

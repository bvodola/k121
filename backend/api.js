const express = require('express');
const { Users } = require('./models');
const router = express.Router();
const secret_santa = require('./secret_santa');

// =======
// Drawing
// =======

// GET /api/users/draw
// Faz o sorteio entre os participantes do amigo secreto
router.get('/users/draw', (req, res) => {
  Users.find({}, (e,users) => {
    if(e) res.send(e);

    else {
      if(users.length < 3)
        res.send({message: 'São necessários ao menos três usuários para um sorteio'});
      else {
        const modifiedUsers = secret_santa.draw(users);

        modifiedUsers.forEach((user) => {
          Users.update({ _id: user._id }, { $set: user }, function(err) {
            if (err)
              console.log(err)
            else
              console.log('OK!')
          });
        })

        res.send(modifiedUsers);
      }
    }
  });
});

// GET /api/users/send
// Envia aos participantes um email com o nome do amigo Secreto
router.get('/users/send', (req, res) => {
  Users.find({}, (e,users) => {
    if(e) res.send(e);

    else {
      secret_santa.sendEmails(users);
      res.sendStatus(200);
    }
  });
});

// ====
// CRUD
// ====

// POST /api/users/
// Cria um novo usuário
router.post('/users/', (req, res) => {
  const user = req.body;
  Users.create(user, (e,user) => {
    if(e) {
      console.log(e);
      res.sendStatus(500);
    }
    else res.send(user);
  });
});

// GET /api/users/ID?
// Retorna um usuário (pelo id) ou o conjunto de todos os usuários
router.get('/users/:_id?', (req, res) => {
  const singleUser = req.params._id ? true : false;
  const query = singleUser ? { _id: req.params._id } : {};

  Users.find(query, (e,users) => {
    if(e) res.sendStatus(500);

    else {
      if(singleUser)
        res.send(users[0]);
      else
        res.send(users);
    }
  });
});

// PUT /api/users/ID
// Atualiza as informações de um usuário
router.put('/users/:_id', (req, res) => {
  const user = req.body;
  Users.update({ _id: req.params._id }, { $set: user }, function(err) {
    if (err)
      res.sendStatus(500);
    else
      res.sendStatus(200);
  });
});

// DELETE /api/users/ID
// Exclui um usuário
router.delete('/users/:_id', (req, res) => {
  Users.remove({ _id: req.params._id }, function(err) {
    if (err)
      res.send(err.message);
    else
      res.sendStatus(200);
  });
});

module.exports = router;

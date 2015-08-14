'use strict';

var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev', 'prince', {
  dialect: 'postgres'
});
var Game = require('../models/Game');
var bodyparser = require('body-parser');

module.exports = function(router) {

  router.use(bodyparser.json());

  router.get('/games', function(req, res) {
    sql.sync()
    .then(function() {
      Game.all()
      .then(function(data) {
        res.json(data);
      })
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      });
    });
  });

  router.post('/games', function(req, res) {
    sql.sync()
    .then(function() {
      Game.create(req.body) //.create is from sequelize
      .then(function(data) {
        res.json(data);
      })
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      });
    });
  });

  router.put('/games/:id', function(req, res) {
    sql.sync()
    .then(function() {
      Game.update(req.body, {where: {id: req.params.id}})
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      });
      res.json({msg: 'successful update'});
    });
  });

  router.delete('/games/:id', function(req, res) {
    sql.sync()
    .then(function() {
      Game.destroy({where: {id: req.params.id}})
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      });
      res.json({msg: 'successful delete'});
    });
  });
};
'use strict';

var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'prince', {dialect: 'postgres'});

var Game = module.exports = sql.define ('Game', {
  date: Sql.DATEONLY,
  eventId: Sql.NUMBER,
  team: Sql.STRING,
  opponent: Sql.STRING,
  teamCourt: Sql.STRING,
  teamScore: Sql.NUMBER,
  opponentScore: Sql.NUMBER,
  spreadOpen: Sql.NUMBER,
  spreadClose: Sql.NUMBER,
  totalOpen: Sql.NUMBER,
  totalClose: Sql.NUMBER
});

Game.sync();
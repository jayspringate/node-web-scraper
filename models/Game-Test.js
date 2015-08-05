'use strict';

var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'prince', {dialect: 'postgres'});

var GameTest = module.exports = sql.define ('GameTest', {
  date: Sql.DATEONLY,
  eventId: {type: Sql.STRING,
            unique: true
          },
  team: Sql.STRING,
  opponent: Sql.STRING,
  teamCourt: Sql.STRING,
  teamScore: Sql.FLOAT,
  opponentScore: Sql.FLOAT,
  spreadOpen: Sql.FLOAT,
  spreadClose: Sql.FLOAT,
  totalOpen: Sql.FLOAT,
  totalClose: Sql.FLOAT,
  season: Sql.STRING,
  gameType: Sql.STRING
},

{
  timestamps: false,
  tableName: 'GamesTest'
});

GameTest.sync();
'use strict';

var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'prince', {dialect: 'postgres'});

var Game = module.exports = sql.define ('Game', {
  date: Sql.DATEONLY,
  eventId: {type: Sql.STRING,
            unique: true,
            primaryKey: true
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
  gameType: Sql.STRING,
  atsGrade: Sql.STRING,
  suGrade: Sql.STRING,
  totalGrade: Sql.STRING,
  spreadMove: Sql.STRING,
  totalMove: Sql.STRING
},

{
  timestamps: false,
  tableName: 'NbaGamesTestNovember'
});

Game.sync();
'use strict';

var Sql = require('sequelize');
var sql = new Sql(process.env.PGDATABASE, process.env.PGUSER,
  process.env.PGPASSWORD, {dialect: 'postgres'});

var cfbGame = module.exports = sql.define ('cfbGame', {
  date: Sql.DATEONLY,
  eventId: {type: Sql.STRING,
            unique: true,
            primaryKey: true
          },
  team: Sql.STRING,
  opponent: Sql.STRING,
  site: Sql.STRING,
  stadium: Sql.STRING,
  teamConference: Sql.STRING,
  opponentConference: Sql.STRING,
  gameConference: Sql.STRING,
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
  totalMove: Sql.STRING,
  dayOfWeek: Sql.STRING,
  attendance: Sql.FLOAT
},

{
  timestamps: false,
  tableName: 'CfbGamesTestcd'
});

cfbGame.sync();
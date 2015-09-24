'use strict';

var Sql = require('sequelize');
var sql = new Sql(process.env.PGDATABASE, process.env.PGUSER,
  process.env.PGPASSWORD, {dialect: 'postgres'});

var Game = module.exports = sql.define ('Game', {
  date: Sql.DATEONLY,
  week: Sql.STRING,
  eventId: {type: Sql.STRING,
            unique: true,
            primaryKey: true
          },
  teamAbbrev: Sql.STRING,
  opponentAbbrev: Sql.STRING,
  teamName: Sql.STRING,
  opponentName: Sql.STRING,
  teamRanking: Sql.FLOAT,
  opponentRanking: Sql.FLOAT,
  teamConference: Sql.STRING,
  opponentConference: Sql.STRING,
  gameConference: Sql.STRING,
  teamSite: Sql.STRING,
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
  attendance: Sql.FLOAT,
  stadium: Sql.STRING,
  teamHomeStadium: Sql.STRING,
  teamDivision: Sql.STRING,
  opponentDivision: Sql.STRING,
  teamConsensus: Sql.FLOAT,
  opponentConsensus: Sql.FLOAT
},

{
  timestamps: false,
  tableName: 'CfbGames'
});

Game.sync();
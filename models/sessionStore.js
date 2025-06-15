const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./index');

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions',               // nome da tabela onde as sessões serão guardadas
  checkExpirationInterval: 15 * 60 * 1000, // verifica sessões expiradas a cada 15 minutos
  expiration: 2 * 60 * 60 * 1000,     // sessão expira após 2 horas
});

module.exports = sessionStore;

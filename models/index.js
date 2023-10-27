const { Sequelize } = require('sequelize');
const config = require('../config.js');

const database = config.database[config.debug ? "dev" : "prod"];

let sequelize = new Sequelize(database.name, database.user, database.password, {
    dialect: database.dialect,
    host: database.host,
    port: database.port,
    logging: false
});

const users = require('./user')(sequelize);
const sale_dates = require('./sale_date')(sequelize);
const events = require('./event')(sequelize);
const artists = require('./artist')(sequelize);

module.exports = { 
    sequelize,
    sale_dates
    events,
    artists
};

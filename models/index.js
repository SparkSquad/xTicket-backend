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

module.exports = { 
    sequelize,
    users,
    sale_dates
};

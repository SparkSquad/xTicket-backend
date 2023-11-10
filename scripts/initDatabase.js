require('dotenv').config();

const { sequelize, users, events, saleDates, tickets } = require('../models');
const Logger = require('../utils/Logger');
const { calculateSHA256Hash } = require('../utils/crypto.js')

const logger = new Logger();

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.success('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        logger.info('Database synchronized successfully.');
    }
    catch (error) {
        logger.fatal('Unable to connect to the database:', error);
    }
}

const initUserInitialData = async () => {
    try {
        await users.create({
            name: "Administrador",
            surnames: "",
            email: "admin@vadam.xyz",
            password: await calculateSHA256Hash("Admin1234."),
            type: "admin"
        });

        await events.create({
            name: "Festival de música",
            genre: "Rock",
            description: "Festival de música de rock",
            location: "Madrid",
            userId: 1
        });

        await saleDates.create({
            saleDate: "2024-06-01",
            price: 100,
            tickets: 100,
            maxTickets: 100,
            adults: 100,
            startTime: "18:00:00",
            endTime: "22:00:00",
            eventId: 1
        });

        await tickets.create({
            uuid: crypto.randomUUID(),
            purchaseDate : "2021-06-01",
            totalTickets: 1,
            price: 100,
            saleDateId: 1,
            userId: 1
        });

        logger.info('Admin user created successfully.');
    }
    catch (error) {
        logger.fatal('Unable to create user:');
        logger.fatal(error);
    }
}

initDatabase().then(async () => {
    await initUserInitialData();
});

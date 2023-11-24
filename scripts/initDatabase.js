require('dotenv').config();

const crypto = require('crypto');
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
            type: 1
        });

        await users.create({
            name: "Liu",
            surnames: "HS",
            email: "liu@gmail.com",
            password: await calculateSHA256Hash("Liu1234."),
            type: "eventPlanner"
        });

        await events.create({
            name: "Festival de música",
            genre: "Rock",
            description: "Festival de música de rock",
            location: "Madrid",
            ticketTakerCode: "1234",
            userId: 2
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

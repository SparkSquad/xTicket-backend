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
            name: "Juan",
            surnames: "García",
            email: "juan@gmail.com",
            password: await calculateSHA256Hash("Juan1234."),
            type: "2"
        });

        await users.create({
            name: "Liu",
            surnames: "HS",
            email: "liu@gmail.com",
            password: await calculateSHA256Hash("Liu1234."),
            type: "3"
        });

        await events.create({
            name: "Festival de música",
            genre: "Rock",
            description: "Festival de música de rock",
            location: "Madrid",
            ticketTakerCode: "1234",
            userId: 2
        });

        await events.create({
            name: "Concierto familiar",
            genre: "Jazz",
            description: "Festival de música de jazz",
            location: "Mexico",
            ticketTakerCode: "123456",
            userId: 2
        });

        await saleDates.create({
            saleDate: "2024-06-01",
            price: 100,
            tickets: 100,
            maxTickets: 2,
            adults: 1,
            startTime: "18:00:00",
            endTime: "22:00:00",
            eventId: 1
        });

        await saleDates.create({
            saleDate: "2024-01-02",
            price: 1200,
            tickets: 100,
            maxTickets: 1,
            adults: 1,
            startTime: "10:00:00",
            endTime: "22:00:00",
            eventId: 2
        });

        await tickets.create({
            uuid: "1234",
            purchaseDate: "2024-01-01",
            totalTickets: 2,
            price: 200,
            saleDateId: 1,
            userId: 1
        });

        await tickets.create({
            uuid: "12345",
            purchaseDate: "2024-01-01",
            totalTickets: 1,
            price: 1200,
            saleDateId: 2,
            userId: 3
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

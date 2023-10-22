require('dotenv').config();

const xTicketServer = require('./Server');

const server = new xTicketServer();

server.start();

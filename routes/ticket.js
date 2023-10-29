const { Router } = require('express');
const { tickets, saleDates } = require('../models');

const router = Router();

router.get('/getAll/:userId', async (req, res) => { 
    const { userId } = req.params;
    try {
        const ticket = await tickets.getByUserId(userId);
        if (ticket.length == 0) {
            return res.status(200).json({
                message: 'No tickets found',
                ticket
            });
        }

        return res.status(200).json({
            message: 'Tickets found',
            ticket
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting tickets',
        });
    }
});

router.post('/create', async (req, res) => {
    const { purchaseDate, totalTickets, price,
        saleDateId, userId }  = req.body
    try {
        var totalTicket = await saleDates.getTicketsByEventId(saleDateId);
        var adquieredTickets = await tickets.countTicketsByEventId(saleDateId);
        var availableTickets = totalTicket - adquieredTickets;
        if (availableTickets >= totalTickets) {
            if (!await tickets.hasTicketForUserAndSaleDate(userId, saleDateId)) {
                const newTicket = await tickets.createTicket(purchaseDate, totalTickets, price,
                    saleDateId, userId);
                return res.status(200).json({
                    message: 'Ticket created'
                });
            } else {
                return res.status(551).json({
                    message: 'You already have a ticket for this event',
                });
            }
        } else {
            return res.status(550).json({
                message: 'No tickets available',
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating ticket',
        });
    }
});

router.delete('/delete/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    try {
        const deletedTicket = await tickets.deleteTicket(ticketId);
        console.log(deletedTicket);
        return res.status(200).json({
            message: 'Ticket deleted'
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting ticket',
        });
    }
});

router.get('/getByUuid/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        const availableTicket = await tickets.getByUuid(uuid);
        return res.status(200).json({
            message: 'Tickets found',
            availableTicket});
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting ticket'
        });
    }
});

module.exports = router;
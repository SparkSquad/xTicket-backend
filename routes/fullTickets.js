const { Router } = require('express');
const { tickets, saleDates, events } = require('../models');

const router = Router();

router.get('/getAll/:userId', async (req, res) => {
    const { userId } = req.params;
    const ticketsWithInfo = [];
    try {
        const listTickets = await tickets.getByUserId(userId);

        if (listTickets.length === 0) {
            return res.status(200).json({
                message: 'No tickets found',
                tickets: ticketsWithInfo
            });
        }

        for (const ticket of listTickets) {
            const saleDateId = ticket.saleDateId;
            const saleDate = await saleDates.getById(saleDateId);
            const eventId = saleDate.eventId;
            const event = await events.getById(eventId);

            const ticketInfo = {
                ticket: ticket,
                saleDate: saleDate,
                eventName: event.name
            };
            if (ticketInfo) {
                ticketsWithInfo.push(ticketInfo);
            }
        }

        if (ticketsWithInfo.length > 0) {
            return res.status(200).json({
                message: 'Tickets found',
                tickets: ticketsWithInfo
            });
        } else {
            return res.status(200).json({
                message: 'No complete ticket information found',
                tickets: ticketsWithInfo
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error getting tickets',
            tickets: ticketsWithInfo
        });
    }
});

module.exports = router;
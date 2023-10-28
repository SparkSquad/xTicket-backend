const { Router } = require('express');
const { tickets } = require('../models');

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
    const ticket = {
        purchaseDate,
        price,
        saleDateId,
        userId
    }  = req.body

    try {
        const newTicket = await tickets.create(ticket);

        return res.status(200).json({
            message: 'Ticket created',
        });
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
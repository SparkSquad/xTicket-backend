const { Router } = require('express');
const { sale_dates } = require('../models');

const router = Router();

router.get('/getAll/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const saleDates = await sale_dates.getByEventId(eventId);
        if (saleDates.length == 0) {
            return res.status(200).json({
                message: 'No sale dates found',
                saleDates
            });
        }

        return res.status(200).json({
            message: 'Sale dates found',
            saleDates
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting sale dates',
        });
    }
});

router.post('/addSaleDate', async (req, res) => {
    const saleDate = {
        adults,
        end_time,
        event_id,
        max_tickets,
        price,
        sale_date,
        start_time,
        tickets
    }  = req.body

    try {
        const newSaleDate = await sale_dates.create(saleDate);

        return res.status(200).json({
            message: 'Sale date created',
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating sale date',
        });
    }
});

router.delete('/deleteSaleDate/:saleDateId', async (req, res) => {
    const { saleDateId } = req.params;
    try {
        const deletedSaleDate = await sale_dates.deleteSaleDate(saleDateId);
        return res.status(200).json({
            message: 'Sale date deleted'
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting sale date'
        });
    }
});

router.put('/putSaleDate/:saleDateId', async (req, res) => {
    const { saleDateId } = req.params;
    const saleDate = {
        adults,
        end_time,
        event_id,
        max_tickets,
        price,
        sale_date,
        start_time,
        tickets
    }  = req.body

    try {
        const updatedSaleDate = await sale_dates.SaleDate(saleDateId, saleDate);
        return res.status(200).json({
            message: 'Sale date updated'
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error updating sale date'
        });
    }
});

module.exports = router;
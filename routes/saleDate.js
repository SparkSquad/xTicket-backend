const { Router } = require('express');
const { saleDates } = require('../models');

const router = Router();

router.get('/getAll/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const saleDate = await saleDates.getByEventId(eventId);

        if (saleDate.length == 0) {
            return res.status(200).json({
                message: 'No sale dates found',
                saleDate
            });
        }

        return res.status(200).json({
            message: 'Sale dates found',
            saleDate
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Error getting sale dates',
        });
    }
});

router.post('/create', async (req, res) => {
    const dateSale = { adults, endTime, eventId, maxTickets,
        price, saleDate, startTime, tickets }  = req.body
    try {
        const newSaleDate = await saleDates.createSaleDate(dateSale);

        return res.status(200).json({
            message: 'Sale date created',
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Error creating sale date',
        });
    }
});

router.put('/update/:saleDateId', async (req, res) => {
    const { saleDateId } = req.params;
    const dateSale = { adults, endTime, eventId, maxTickets, price,
        saleDate, startTime, tickets }  = req.body

    try {
        const updatedSaleDate = await saleDates.updateSaleDate(saleDateId, dateSale);
        if (updatedSaleDate == 0) {
            return res.status(404).json({
                message: 'No sale date found'
            });
        }
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

router.delete('/delete/:saleDateId', async (req, res) => {
    const { saleDateId } = req.params;
    try {
        
        const deletedSaleDate = await saleDates.deleteSaleDate(saleDateId);
        if (deletedSaleDate == 0) {
            return res.status(404).json({
                message: 'No sale date found'
            });
        }

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

module.exports = router;
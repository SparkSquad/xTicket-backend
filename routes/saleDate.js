const { Router } = require('express');
const { sale_dates } = require('../models');

const router = Router();

router.get('/getAll/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const saleDates = await sale_dates.getByEventId(eventId);

    if (saleDates.length == 0) {
        return res.status(200).json({
            message: 'No sale dates found',
            saleDates
        });
    }

    return res.status(200).json({
        message: 'search successful',
        saleDates
    });
});

module.exports = router;